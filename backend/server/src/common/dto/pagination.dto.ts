import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Кількість записів',
    default: 5,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 5;

  @ApiPropertyOptional({
    description: 'Скільки пропустити',
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @ApiPropertyOptional({ description: 'Пошуковий запит' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'ID профілю організації' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  organization_profile_id?: number;

  @ApiPropertyOptional({
    description: 'Фільтр контексту (напр. "news", "fundraising", "projects")',
  })
  @IsOptional()
  @IsString()
  for?: string;

  @ApiPropertyOptional({
    description: 'Таб тікетів для організації',
    enum: ['available', 'my'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['available', 'my'])
  tab?: 'available' | 'my';

  @ApiPropertyOptional({ description: 'Фільтр по місту' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Дата від (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Дата до (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dateTo?: string;

  @ApiPropertyOptional({ description: 'Масив slug категорій' })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? (value as string[])
      : value
        ? [value as string]
        : undefined,
  )
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({ description: 'Масив статусів' })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? (value as string[])
      : value
        ? [value as string]
        : undefined,
  )
  @IsString({ each: true })
  status?: string[];
}
