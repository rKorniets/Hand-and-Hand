import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { task_difficulty_enum } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'ID проєкту, до якого належить таска',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  project_id: number;

  @ApiPropertyOptional({
    description: 'ID тікета (якщо таска створена на основі тікета)',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  ticket_id?: number;

  @ApiProperty({
    description: 'Заголовок таски',
    example: 'Відвезти гуманітарну допомогу',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Детальний опис задачі' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiPropertyOptional({
    enum: task_difficulty_enum,
    default: task_difficulty_enum.MEDIUM,
  })
  @IsOptional()
  @IsEnum(task_difficulty_enum)
  difficulty?: task_difficulty_enum;

  @ApiProperty({
    description: 'Базова винагорода в балах за виконання',
    example: 100,
  })
  @IsInt()
  @Min(0)
  @Max(10000)
  points_reward_base: number;

  @ApiPropertyOptional({
    description: 'ID локації, де потрібно виконати задачу',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  location_id?: number;

  @ApiPropertyOptional({
    description: 'Дедлайн виконання задачі (ISO 8601)',
    example: '2026-04-10T15:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}
