import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRewardDto {
  @ApiProperty({ description: 'Назва нагороди', example: 'Футболка волонтера' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Опис нагороди' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({ description: 'Вартість нагороди в балах', example: 200 })
  @IsInt()
  @Min(1)
  @Max(1000000)
  cost_points: number;

  @ApiProperty({ description: 'Кількість одиниць в наявності', example: 50 })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ description: 'Чи активна нагорода', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
