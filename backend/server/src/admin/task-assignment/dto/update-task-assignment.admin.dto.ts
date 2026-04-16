import { PartialType } from '@nestjs/swagger';
import { CreateTaskAssignmentAdminDto } from './create-task-assignment.admin.dto';

export class UpdateTaskAssignmentAdminDto extends PartialType(
  CreateTaskAssignmentAdminDto,
) {}
