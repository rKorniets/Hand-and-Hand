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

  private sanitizeCampaign<T extends { mono_token?: string | null }>(
    campaign: T,
  ): Omit<T, 'mono_token'> | null {
    if (!campaign) return null;
    const safeCampaign = { ...campaign };
    delete safeCampaign.mono_token;
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
      throw new NotFoundException(`Campaign with ID ${id} was not found`);
    }

    const ownerUserId =
      campaign.organization_profile?.user_id ??
      campaign.volunteer_profile?.user_id;

    if (ownerUserId !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return campaign;
  }

  async findAll(
    limit: number,
    skip: number,
    status?:
      | fundraising_campaign_status_enum
      | fundraising_campaign_status_enum[],
    search?: string,
    categories?: string[],
  ) {
    const whereClause: Prisma.fundraising_campaignWhereInput = {};

    if (search) {
      whereClause.title = { contains: search, mode: 'insensitive' };
    }

    if (status) {
      // TypeScript автоматично виведе тип як масив Enum, 'as' не потрібен
      const statusArray = Array.isArray(status) ? status : [status];
      whereClause.status = {
        in: statusArray,
      };
    }

    if (categories && categories.length > 0) {
      whereClause.fundraising_category = {
        some: {
          category: {
            slug: { in: categories },
          },
        },
      };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.fundraising_campaign.findMany({
        where: whereClause,
        take: limit,
        skip,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.fundraising_campaign.count({ where: whereClause }),
    ]);

    return {
      data: data.map((c) => this.sanitizeCampaign(c)),
      total,
    };
  }

  async create(data: CreateFundraisingCampaignDto, userId: number) {
    const orgProfile = await this.prisma.organization_profile.findFirst({
      where: { user_id: userId },
      select: { id: true },
    });

    const volProfile = !orgProfile
      ? await this.prisma.volunteer_profile.findFirst({
          where: { user_id: userId },
          select: { id: true },
        })
      : null;

    if (!orgProfile && !volProfile) {
      throw new ForbiddenException(
        'Не знайдено профіль організації або волонтера для цього користувача',
      );
    }

    let jarId: string | null = null;

    try {
      if (data.jar_link && data.mono_token) {
        const jar = await this.monobankService.prepareJarData(
          data.jar_link,
          data.mono_token,
        );
        jarId = jar.id;
      }
    } catch (e) {
      console.warn(
        'Monobank setup failed:',
        e instanceof Error ? e.message : e,
      );
    }

    const createData: Prisma.fundraising_campaignCreateInput = {
      title: data.title,
      description: data.description,
      main_content: data.main_content,
      goal_amount: data.goal_amount,
      start_at: data.start_at ? new Date(data.start_at) : undefined,
      end_at: data.end_at ? new Date(data.end_at) : undefined,
      jar_link: data.jar_link,
      jar_id: jarId,
      mono_token: data.mono_token,
      image_url: data.image_url,
    };

    if (data.organization_profile_id) {
      createData.organization_profile = {
        connect: { id: data.organization_profile_id },
      };
    } else if (data.volunteer_profile_id) {
      createData.volunteer_profile = {
        connect: { id: data.volunteer_profile_id },
      };
    if (orgProfile) {
      createData.organization_profile = { connect: { id: orgProfile.id } };
    } else if (volProfile) {
      createData.volunteer_profile = { connect: { id: volProfile.id } };
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
