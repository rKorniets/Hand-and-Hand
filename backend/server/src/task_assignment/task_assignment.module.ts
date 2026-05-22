import { Module } from '@nestjs/common';
import { TaskAssignmentService } from './task_assignment.service';
import { TaskAssignmentController } from './task_assignment.controller';
import { PointsModule } from '../points/points.module';
import { AchievementService } from './achievement.service';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [PointsModule, WebsocketModule],
  controllers: [TaskAssignmentController],
  providers: [TaskAssignmentService, AchievementService],
})
export class TaskAssignmentModule {}
