import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, fundraising_campaign_status_enum } from '@prisma/client';
import { CreateFundraisingCampaignDto } from './dto/create-fundraising_campaign.dto';

@Injectable()
export class FundraisingCampaignService {
  constructor(private prisma: PrismaService) {}

  async findAll(limit: number, status?: fundraising_campaign_status_enum) {
    const whereClause: Prisma.fundraising_campaignWhereInput = status
      ? { status }
      : {};
    return this.prisma.fundraising_campaign.findMany({
      where: whereClause,
      take: limit,
      orderBy: { created_at: 'desc' },
    });
  }

  async create(data: CreateFundraisingCampaignDto) {
    return this.prisma.fundraising_campaign.create({ data });
  }

  async update(id: number, data: CreateFundraisingCampaignDto) {
    return this.prisma.fundraising_campaign.update({
      where: { id },
      data: { ...data, updated_at: new Date() },
    });
  }

  async remove(id: number) {
    return this.prisma.fundraising_campaign.delete({ where: { id } });
  }
}
