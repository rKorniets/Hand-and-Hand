import { Module } from '@nestjs/common';
import { TaskAssignmentService } from './task_assignment.service';
import { TaskAssignmentController } from './task_assignment.controller';

@Module({
  controllers: [TaskAssignmentController],
  providers: [TaskAssignmentService],
})
export class TaskAssignmentModule {}
