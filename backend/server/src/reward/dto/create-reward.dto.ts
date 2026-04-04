import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRewardDto {
  @ApiProperty({ description: 'Назва нагороди', example: 'Футболка волонтера' })
  title: string;

  @ApiProperty({ description: 'Опис нагороди' })
  description: string;

  @ApiProperty({ description: 'Поріг балів для розблокування', example: 200 })
  threshold_points: number;

  @ApiPropertyOptional({ description: 'Чи активна нагорода', default: true })
  is_active?: boolean;
}
