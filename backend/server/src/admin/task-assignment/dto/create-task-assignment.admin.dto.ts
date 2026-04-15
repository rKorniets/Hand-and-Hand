import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
} from 'class-validator';
import { task_assignment_status_enum } from '@prisma/client';

export class CreateTaskAssignmentAdminDto {
  @ApiProperty({ description: 'ID завдання' })
  @IsInt()
  task_id: number;

  @ApiProperty({ description: 'ID профілю волонтера' })
  @IsInt()
  volunteer_profile_id: number;

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

  @ApiPropertyOptional({
    description: 'Підтвердження від організатора (Тільки Адмін/Орг)',
  })
  @IsOptional()
  @IsBoolean()
  requester_confirmed?: boolean;
}
