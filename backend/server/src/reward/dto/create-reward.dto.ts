import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRewardDto {
  @ApiProperty({ description: 'Назва нагороди', example: 'Футболка волонтера' })
  title: string;

  @ApiProperty({ description: 'Опис нагороди' })
  description: string;

  @ApiProperty({ description: 'Вартість у балах', example: 200 })
  cost_points: number;

  @ApiProperty({ description: 'Кількість на складі', example: 50 })
  stock: number;

  @ApiPropertyOptional({ description: 'Чи активна нагорода', default: true })
  is_active?: boolean;
}
