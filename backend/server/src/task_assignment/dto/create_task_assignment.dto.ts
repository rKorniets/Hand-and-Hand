import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';
import { task_assignment_status_enum } from '@prisma/client';

export class CreateTaskAssignmentDto {
  @ApiProperty({ description: 'ID завдання' })
  @IsInt()
  task_id: number;

  @ApiPropertyOptional({
    description: 'Статус виконання',
    enum: task_assignment_status_enum,
  })
  @IsOptional()
  @IsEnum(task_assignment_status_enum)
  status?: task_assignment_status_enum;

  @ApiPropertyOptional({ description: 'Коментар до виконання' })
  @IsOptional()
  @IsString()
  comment?: string;

}
