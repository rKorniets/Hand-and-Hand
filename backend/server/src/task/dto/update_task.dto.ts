import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create_task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
