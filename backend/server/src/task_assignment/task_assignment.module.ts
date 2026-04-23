import { Module } from '@nestjs/common';
import { TaskAssignmentService } from './task_assignment.service';
import { TaskAssignmentController } from './task_assignment.controller';
import { PointsModule } from '../points/points.module';

@Module({
  imports: [PointsModule],
  controllers: [TaskAssignmentController],
  providers: [TaskAssignmentService],
})
export class TaskAssignmentModule {}
