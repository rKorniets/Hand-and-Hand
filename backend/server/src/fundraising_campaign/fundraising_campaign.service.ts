import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, fundraising_campaign_status_enum } from '@prisma/client';
import { CreateFundraisingCampaignDto } from './dto/create-fundraising_campaign.dto';
import { MonobankService } from './monobank.service';

export interface RequestUser {
  id: number;
}

@Injectable()
export class FundraisingCampaignService {
  constructor(
    private prisma: PrismaService,
    private monobankService: MonobankService,
  ) {}

  private sanitizeCampaign(campaign: {
    mono_token?: string;
    [key: string]: unknown;
  }) {
    const { mono_token, ...safeCampaign } = campaign;
    return safeCampaign;
  }

  private async validateOwnership(id: number, currentUser: RequestUser) {
    const campaign = await this.prisma.fundraising_campaign.findUnique({
      where: { id },
      include: {
        organization_profile: { select: { user_id: true } },
        volunteer_profile: { select: { user_id: true } },
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaing with ${id} was not found`);
    }

    const ownerUserId =
      campaign.organization_profile?.user_id ??
      campaign.volunteer_profile?.user_id;

    if (ownerUserId !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have permission to do this action',
      );
    }

    return campaign;
  }
  async findAll(
    limit: number,
    skip: number,
    status?: fundraising_campaign_status_enum,
    search?: string,
  ) {
    const whereClause: Prisma.fundraising_campaignWhereInput = {
      ...(status && { status }),
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.fundraising_campaign.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.fundraising_campaign.count({ where: whereClause }),
    ]);

    const safeData = data.map((c) => this.sanitizeCampaign(c));

    return { data: safeData, total };
  }

  async create(data: CreateFundraisingCampaignDto) {
    this.monobankService.validateMonoData(data.jar_link, data.mono_token);

    const sendId = this.monobankService.extractSendId(data.jar_link);
    const clientInfo = await this.monobankService.fetchClientInfo(
      data.mono_token,
    );
    const jar = this.monobankService.findJarBySendId(clientInfo, sendId);

    await this.monobankService.setWebhook(data.mono_token);

    const createData: Prisma.fundraising_campaignCreateInput = {
      title: data.title,
      description: data.description,
      main_content: data.main_content,
      goal_amount: data.goal_amount,
      start_at: data.start_at ? new Date(data.start_at) : undefined,
      end_at: data.end_at ? new Date(data.end_at) : undefined,
      jar_link: data.jar_link,
      jar_id: jar.id,
      mono_token: data.mono_token,
      image_url: data.image_url,
    };

    if (data.organization_profile_id) {
      createData.organization_profile = {
        connect: { id: data.organization_profile_id },
      };
    }

    if (data.volunteer_profile_id) {
      createData.volunteer_profile = {
        connect: { id: data.volunteer_profile_id },
      };
    }

    const campaign = await this.prisma.fundraising_campaign.create({
      data: createData,
    });

    return this.sanitizeCampaign(campaign);
  }

  async update(
    id: number,
    data: CreateFundraisingCampaignDto,
    currentUser: RequestUser,
  ) {
    await this.validateOwnership(id, currentUser);

    const campaign = await this.prisma.fundraising_campaign.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        main_content: data.main_content,
        goal_amount: data.goal_amount,
        start_at: data.start_at ? new Date(data.start_at) : undefined,
        end_at: data.end_at ? new Date(data.end_at) : undefined,
        image_url: data.image_url,
        updated_at: new Date(),
      },
    });
    return this.sanitizeCampaign(campaign);
  }

  async remove(id: number, currentUser: RequestUser) {
    await this.validateOwnership(id, currentUser);

    const campaign = await this.prisma.fundraising_campaign.delete({
      where: { id },
    });

    return this.sanitizeCampaign(campaign);
  }

  async processDonation(
    campaignId: number,
    amount: number,
    donorName?: string,
    message?: string,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const newDonation = await tx.donation.create({
        data: {
          campaign_id: campaignId,
          amount: amount,
          donor_name: donorName,
          message: message,
        },
      });
      await tx.fundraising_campaign.update({
        where: { id: campaignId },
        data: {
          current_amount: {
            increment: amount,
          },
        },
      });

      return newDonation;
    });
  }

  async findByJarId(jarId: string) {
    return this.prisma.fundraising_campaign.findFirst({
      where: { jar_id: jarId.trim() },
      select: {
        id: true,
        jar_id: true,
      },
    });
  }

  async updateBalance(campaignId: number, balance: string) {
    await this.prisma.fundraising_campaign.update({
      where: { id: campaignId },
      data: {
        current_amount: new Prisma.Decimal(balance),
        updated_at: new Date(),
      },
    });
  }
}
