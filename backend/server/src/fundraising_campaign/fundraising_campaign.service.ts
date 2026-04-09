import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, fundraising_campaign_status_enum } from '@prisma/client';
import { CreateFundraisingCampaignDto } from './dto/create-fundraising_campaign.dto';

export interface RequestUser {
  id: number;
}

@Injectable()
export class FundraisingCampaignService {
  constructor(private prisma: PrismaService) {}

  private async validateOwnership(id: number, currentUser: RequestUser) {
    const campaign = await this.prisma.fundraising_campaign.findUnique({
      where: { id },
      include: {
        organization_profile: { select: { user_id: true } },
        volunteer_profile: { select: { user_id: true } },
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campain with ${id} was not found`);
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

    return { data, total };
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

  async update(
    id: number,
    data: CreateFundraisingCampaignDto,
    currentUser: RequestUser,
  ) {
    await this.validateOwnership(id, currentUser);

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

  async remove(id: number, currentUser: RequestUser) {
    await this.validateOwnership(id, currentUser);

    return this.prisma.fundraising_campaign.delete({ where: { id } });
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
}
