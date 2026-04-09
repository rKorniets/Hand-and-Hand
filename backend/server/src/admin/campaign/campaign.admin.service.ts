import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CampaignQueryAdminDto } from './dto/campaign-query.admin.dto';
import { CreateFundraisingCampaignDto } from '../../fundraising_campaign/dto/create-fundraising_campaign.dto';
import { Prisma, fundraising_campaign_status_enum } from '@prisma/client';

@Injectable()
export class CampaignAdminService {
  constructor(private readonly prisma: PrismaService) {}

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
      throw new NotFoundException(`Збір коштів з ID ${id} не знайдено`);
    }

    return campaign;
  }

  async create(data: CreateFundraisingCampaignDto) {
    return this.prisma.fundraising_campaign.create({
      data: {
        organization_profile_id: data.organization_profile_id,
        volunteer_profile_id: data.volunteer_profile_id,
        title: data.title,
        description: data.description,
        main_content: data.main_content,
        goal_amount: data.goal_amount,
        start_at: data.start_at,
        end_at: data.end_at,
        bank_link: data.bank_link,
        image_url: data.image_url,
      },
    });
  }

  async update(id: number, data: CreateFundraisingCampaignDto) {
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
        bank_link: data.bank_link,
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
