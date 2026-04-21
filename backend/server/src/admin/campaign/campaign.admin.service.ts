import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CampaignQueryAdminDto } from './dto/campaign-query.admin.dto';
import { CreateCampaignAdminDto } from './dto/create-campaign.admin.dto';
import { Prisma, fundraising_campaign_status_enum } from '@prisma/client';
import { MonobankService } from '../../fundraising_campaign/monobank.service';

@Injectable()
export class CampaignAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly monobankService: MonobankService,
  ) {}

  async findAll(query: CampaignQueryAdminDto) {
    const where: Prisma.fundraising_campaignWhereInput = {
      ...(query.status && { status: query.status }),
      ...(query.search && {
        title: { contains: query.search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.fundraising_campaign.findMany({
        where,
        take: query.limit,
        skip: query.skip,
        orderBy: { created_at: 'desc' },
        include: {
          organization_profile: { select: { id: true, name: true } },
          volunteer_profile: { select: { id: true, display_name: true } },
        },
      }),
      this.prisma.fundraising_campaign.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const campaign = await this.prisma.fundraising_campaign.findUnique({
      where: { id },
      include: {
        organization_profile: { select: { id: true, name: true } },
        volunteer_profile: { select: { id: true, display_name: true } },
        donation: { orderBy: { created_at: 'desc' } },
      },
    });

    if (!campaign) {
      throw new NotFoundException(
        `Fundraising campaign with ID ${id} not found`,
      );
    }

    return campaign;
  }

  async create(data: CreateCampaignAdminDto) {
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
    }

    if (data.volunteer_profile_id) {
      createData.volunteer_profile = {
        connect: { id: data.volunteer_profile_id },
      };
    }

    return this.prisma.fundraising_campaign.create({
      data: createData,
    });
  }

  async update(id: number, data: CreateCampaignAdminDto) {
    await this.findOne(id);

    return this.prisma.fundraising_campaign.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        main_content: data.main_content,
        goal_amount: data.goal_amount,
        start_at: data.start_at,
        end_at: data.end_at,
        jar_link: data.jar_link,
        image_url: data.image_url,
        updated_at: new Date(),
      },
    });
  }

  async updateStatus(id: number, status: fundraising_campaign_status_enum) {
    await this.findOne(id);

    return this.prisma.fundraising_campaign.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.fundraising_campaign.delete({ where: { id } });
  }
}
