import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Prisma,
  fundraising_campaign_status_enum,
  user_role_enum,
} from '@prisma/client';
import { CreateFundraisingCampaignDto } from './dto/create-fundraising_campaign.dto';
import { MonobankService } from './monobank.service';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { mono_token, ...safeCampaign } = campaign;
    return safeCampaign;
  }

  private async checkOwnership(
    campaignId: number,
    userId: number,
    role: user_role_enum,
  ) {
    const campaign = await this.prisma.fundraising_campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) throw new NotFoundException(`Збір не знайдено`);

    if (role === user_role_enum.ADMIN) return campaign;

    const [volunteer, organization] = await Promise.all([
      this.prisma.volunteer_profile.findUnique({ where: { user_id: userId } }),
      this.prisma.organization_profile.findUnique({
        where: { user_id: userId },
      }),
    ]);

    const isOwner =
      (volunteer && campaign.volunteer_profile_id === volunteer.id) ||
      (organization && campaign.organization_profile_id === organization.id);

    if (!isOwner) throw new ForbiddenException('Це не ваш збір!');

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

  async create(data: CreateFundraisingCampaignDto, userId: number) {
    const [volunteer, organization] = await Promise.all([
      this.prisma.volunteer_profile.findUnique({ where: { user_id: userId } }),
      this.prisma.organization_profile.findUnique({
        where: { user_id: userId },
      }),
    ]);

    if (!volunteer && !organization) {
      throw new ForbiddenException(
        'Потрібен профіль волонтера або організації',
      );
    }

    let jarId: string | null = null;
    try {
      const jar = await this.monobankService.prepareJarData(
        data.jar_link,
        data.mono_token,
      );
      jarId = jar.id;
    } catch (e) {
      console.warn('Monobank setup failed:', e);
    }

    const campaign = await this.prisma.fundraising_campaign.create({
      data: {
        ...data,
        jar_id: jarId,
        volunteer_profile_id: volunteer?.id,
        organization_profile_id: organization?.id,
      },
    });

    return this.sanitizeCampaign(campaign);
  }

  async update(
    id: number,
    data: CreateFundraisingCampaignDto,
    userId: number,
    role: user_role_enum,
  ) {
    await this.checkOwnership(id, userId, role);
    const campaign = await this.prisma.fundraising_campaign.update({
      where: { id },
      data: { ...data, updated_at: new Date() },
    });
    return this.sanitizeCampaign(campaign);
  }

  async remove(id: number, userId: number, role: user_role_enum) {
    await this.checkOwnership(id, userId, role);
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

  async updateBalance(id: number, balance: string) {
    return this.prisma.fundraising_campaign.update({
      where: { id },
      data: {
        current_amount: new Prisma.Decimal(balance),
        updated_at: new Date(),
      },
    });
  }
}
