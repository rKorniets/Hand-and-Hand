import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { report_type_enum } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateReportDto {
  @ApiPropertyOptional({
    description: 'ID проєкту до якого відноситься звіт',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  project_id?: number;

  @ApiProperty({
    description: 'Заголовок звіту',
    example: 'Звіт за березень 2025',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    enum: report_type_enum,
    description: 'Тип звіту',
  })
  @IsEnum(report_type_enum)
  type: report_type_enum;

  @ApiProperty({
    description: 'URL файлу звіту',
    example: 'https://example.com/report.pdf',
  })
  @IsString()
  @IsUrl()
  file_url: string;

  @ApiPropertyOptional({
    description: 'Дата публікації звіту',
  })
  @IsOptional()
  @IsDateString()
  published_at?: string;
}
