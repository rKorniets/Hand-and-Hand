import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RewardRedemptionService } from './reward-redemption.service';

@Module({
  imports: [PrismaModule],
  controllers: [RewardController],
  providers: [RewardService, RewardRedemptionService],
  exports: [RewardService, RewardRedemptionService],
})
export class RewardModule {}
