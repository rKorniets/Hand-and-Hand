import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class RewardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(limit?: number, skip?: number, search?: string) {
    const whereClause: Prisma.rewardWhereInput = search
      ? {
          title: { contains: search, mode: 'insensitive' },
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.reward.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { created_at: 'desc' },
        include: { reward_redemption: true },
      }),
      this.prisma.reward.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const reward = await this.prisma.reward.findUnique({
      where: { id },
      include: { reward_redemption: true },
    });
    if (!reward) throw new NotFoundException(`Reward with ID ${id} not found`);
    return reward;
  }

  async create(data: CreateRewardDto) {
    return this.prisma.reward.create({
      data: {
        title: data.title,
        description: data.description,
        cost_points: data.cost_points,
        stock: data.stock,
        is_active: data.is_active ?? true,
      },
    });
  }

  async update(id: number, data: UpdateRewardDto) {
    await this.findOne(id);
    const updateData: Prisma.rewardUpdateInput = { ...data };
    return this.prisma.reward.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.reward.delete({ where: { id } });
  }
}
