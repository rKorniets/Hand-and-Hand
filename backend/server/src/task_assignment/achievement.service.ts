import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppGateway } from '../websocket/app.gateway';
import {
  reward_type_enum,
  task_assignment_status_enum,
  notification_type_enum,
} from '@prisma/client';

@Injectable()
export class AchievementService {
  private readonly logger = new Logger(AchievementService.name);

  constructor(
    private prisma: PrismaService,
    private appGateway: AppGateway,
  ) {}

  async checkAndGrantAchievements(userId: number) {
    try {
      const completedTasksCount = await this.prisma.task_assignment.count({
        where: {
          volunteer_profile: { user_id: userId },
          status: task_assignment_status_enum.COMPLETED,
        },
      });

      const eligibleAchievements = await this.prisma.reward.findMany({
        where: {
          type: reward_type_enum.ACHIEVEMENT,
          is_active: true,
          condition_count: { lte: completedTasksCount },
        },
      });

      if (eligibleAchievements.length === 0) return;

      const existingRedemptions = await this.prisma.reward_redemption.findMany({
        where: {
          user_id: userId,
          reward_id: { in: eligibleAchievements.map((a) => a.id) },
        },
        select: { reward_id: true },
      });

      const existingIds = new Set(existingRedemptions.map((r) => r.reward_id));
      const newAchievements = eligibleAchievements.filter(
        (a) => !existingIds.has(a.id),
      );

      if (newAchievements.length > 0) {
        await this.prisma.$transaction(async (tx) => {
          for (const achievement of newAchievements) {
            await tx.reward_redemption.create({
              data: {
                user_id: userId,
                reward_id: achievement.id,
              },
            });

            await tx.notification.create({
              data: {
                user_id: userId,
                message: `🏆 Вітаємо! Ви здобули нове досягнення: "${achievement.title}".`,
                type: notification_type_enum.REWARD,
              },
            });

            this.logger.log(
              `User ${userId} unlocked achievement: ${achievement.title}`,
            );
          }
        });

        this.appGateway.sendToAll('achievementUnlocked', {
          userId,
          newAchievementsCount: newAchievements.length,
        });
      }
    } catch (error) {
      this.logger.error('Error checking achievements', error);
    }
  }
}
