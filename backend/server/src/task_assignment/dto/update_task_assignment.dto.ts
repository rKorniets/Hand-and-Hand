import { PartialType } from '@nestjs/swagger';
import { CreateTaskAssignmentDto } from './create_task_assignment.dto';

export class UpdateTaskAssignmentDto extends PartialType(
  CreateTaskAssignmentDto,
) {}
