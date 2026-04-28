import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, fundraising_campaign_status_enum } from '@prisma/client';
import { CreateFundraisingCampaignDto } from './dto/create-fundraising_campaign.dto';
import { MonobankService } from './monobank.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateFundraisingCampaignDto } from './dto/update-fundraising_campaign.dto';

export interface RequestUser {
  id: number;
}

@Injectable()
export class FundraisingCampaignService {
  constructor(
    private prisma: PrismaService,
    private monobankService: MonobankService,
    private cloudinary: CloudinaryService,
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

    // Якщо статус не передано — за замовчуванням показуємо тільки ACTIVE
    const filterStatus = status ?? fundraising_campaign_status_enum.ACTIVE;
    const statusArray = Array.isArray(filterStatus)
      ? filterStatus
      : [filterStatus];
    whereClause.status = { in: statusArray };

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
        include: {
          organization_profile: {
            select: { name: true },
          },
          volunteer_profile: {
            select: { display_name: true },
          },
        },
      }),
      this.prisma.fundraising_campaign.count({ where: whereClause }),
    ]);

    return {
      data: data.map((c) => this.sanitizeCampaign(c)),
      total,
    };
  }

  async create(data: CreateFundraisingCampaignDto, currentUser: RequestUser) {
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
    let orgProfileId: number | undefined = undefined;
    let volProfileId: number | undefined = undefined;

    const orgProfile = await this.prisma.organization_profile.findUnique({
      where: { user_id: currentUser.id },
    });

    if (orgProfile) {
      orgProfileId = orgProfile.id;
    } else {
      const volProfile = await this.prisma.volunteer_profile.findUnique({
        where: { user_id: currentUser.id },
      });

      if (volProfile) {
        volProfileId = volProfile.id;
      } else {
        throw new ForbiddenException(
          'Для створення збору потрібно мати профіль організації або волонтера.',
        );
      }
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

    if (orgProfileId) {
      createData.organization_profile = {
        connect: { id: orgProfileId },
      };
    }

    if (volProfileId) {
      createData.volunteer_profile = {
        connect: { id: volProfileId },
      };
    }

    const campaign = await this.prisma.fundraising_campaign.create({
      data: createData,
    });

    return this.sanitizeCampaign(campaign);
  }

  async update(
    id: number,
    data: UpdateFundraisingCampaignDto,
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
        updated_at: new Date(),
      },
    });
    return this.sanitizeCampaign(campaign);
  }
  async updateImage(
    id: number,
    file: Express.Multer.File,
    currentUser: RequestUser,
  ): Promise<{ image_url: string }> {
    const existing = await this.validateOwnership(id, currentUser);
    if (existing.image_url)
      await this.cloudinary.deleteImage(existing.image_url);
    const image_url = await this.cloudinary.uploadFundraisingImage(file);
    await this.prisma.fundraising_campaign.update({
      where: { id },
      data: { image_url },
    });
    return { image_url };
  }
  async remove(id: number, currentUser: RequestUser) {
    const existing = await this.validateOwnership(id, currentUser);
    if (existing.image_url)
      await this.cloudinary.deleteImage(existing.image_url); // ← додати
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
    const campaign = await this.prisma.fundraising_campaign.findUnique({
      where: { id: campaignId },
      select: { goal_amount: true, status: true },
    });

    if (!campaign) return;

    const currentBalance = new Prisma.Decimal(balance);
    let newStatus = campaign.status;
    if (
      currentBalance.gte(campaign.goal_amount) &&
      campaign.status === fundraising_campaign_status_enum.ACTIVE
    ) {
      newStatus = fundraising_campaign_status_enum.COMPLETED;
    }

    await this.prisma.fundraising_campaign.update({
      where: { id: campaignId },
      data: {
        current_amount: currentBalance,
        status: newStatus,
        updated_at: new Date(),
      },
    });
  }
  async findOne(id: number) {
    const campaign = await this.prisma.fundraising_campaign.findUnique({
      where: { id },
      include: {
        organization_profile: {
          select: { name: true },
        },
        volunteer_profile: {
          select: { display_name: true },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Збір з ID ${id} не знайдено`);
    }

    return this.sanitizeCampaign(campaign);
  }
}
