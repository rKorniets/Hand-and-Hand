import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { task_status_enum, task_difficulty_enum } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({
    description: 'ID проєкту, до якого належить таска',
    example: 1,
  })
  project_id: number;

  @ApiPropertyOptional({
    description: 'ID тікета (якщо таска створена на основі тікета)',
    example: 2,
  })
  ticket_id?: number;

  @ApiProperty({
    description: 'Заголовок таски',
    example: 'Відвезти гуманітарну допомогу',
  })
  title: string;

  @ApiProperty({ description: 'Детальний опис задачі' })
  description: string;

  @ApiPropertyOptional({
    enum: task_status_enum,
    default: task_status_enum.OPEN,
  })
  status?: task_status_enum;

  @ApiPropertyOptional({
    enum: task_difficulty_enum,
    default: task_difficulty_enum.MEDIUM,
  })
  difficulty?: task_difficulty_enum;

  @ApiProperty({
    description: 'Базова винагорода в балах за виконання',
    example: 100,
  })
  points_reward_base: number;

  @ApiPropertyOptional({
    description: 'ID локації, де потрібно виконати задачу',
    example: 5,
  })
  location_id?: number;

  @ApiPropertyOptional({
    description: 'Дедлайн виконання задачі (ISO 8601)',
    example: '2026-04-10T15:00:00Z',
  })
  deadline?: string | Date;
}
