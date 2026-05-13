import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RewardRedemptionService {
  constructor(private readonly prisma: PrismaService) {}

  async redeem(userId: number, rewardId: number) {
    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
    });
    if (!reward) {
      throw new NotFoundException(`Reward with ID ${rewardId} not found`);
    }
    if (!reward.is_active) {
      throw new BadRequestException('Нагорода недоступна');
    }
    const user = await this.prisma.app_user.findUnique({
      where: { id: userId },
      select: { points: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.points < reward.cost_points) {
      throw new BadRequestException('Not enough points');
    }
    const existing = await this.prisma.reward_redemption.findFirst({
      where: { user_id: userId, reward_id: rewardId },
    });

    if (existing) {
      throw new ConflictException('Ви вже отримували цю нагороду');
    }
    return this.prisma.$transaction(async (tx) => {
      await tx.app_user.update({
        where: { id: userId },
        data: { points: { decrement: reward.cost_points } },
      });

      await tx.points_transaction.create({
        data: {
          user_id: userId,
          amount: -reward.cost_points,
          type: 'SPEND',
          reason: `Обмін на нагороду: ${reward.title}`,
        },
      });

      return tx.reward_redemption.create({
        data: {
          user_id: userId,
          reward_id: rewardId,
        },
        include: {
          reward: true,
        },
      });
    });
  }

  async getMyRedemptions(userId: number) {
    return this.prisma.reward_redemption.findMany({
      where: { user_id: userId },
      include: {
        reward: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getAllRedemptions(limit?: number, skip?: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.reward_redemption.findMany({
        take: limit,
        skip,
        orderBy: { created_at: 'desc' },
        include: {
          reward: true,
          app_user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.reward_redemption.count(),
    ]);

    return { data, total };
  }
}
