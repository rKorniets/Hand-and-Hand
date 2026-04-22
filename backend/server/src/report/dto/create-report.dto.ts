import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { report_type_enum } from '@prisma/client';

export class CreateReportDto {
  @ApiPropertyOptional({
    description: 'ID проєкту до якого відноситься звіт',
    example: 3,
  })
  project_id?: number;

  @ApiProperty({
    description: 'Заголовок звіту',
    example: 'Звіт за березень 2025',
  })
  title: string;

  @ApiProperty({
    enum: report_type_enum,
    description: 'Тип звіту',
  })
  type: report_type_enum;

  @ApiProperty({
    description: 'URL файлу звіту',
    example: 'https://example.com/report.pdf',
  })
  file_url: string;

  @ApiProperty({
    description: 'Дата публікації звіту',
  })
  published_at: Date;
}
