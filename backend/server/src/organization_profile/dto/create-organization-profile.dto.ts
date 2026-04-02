import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, IsEnum } from 'class-validator';
import { verification_status_enum } from '@prisma/client';

export class CreateOrganizationProfileDto {
  @ApiProperty({ description: 'ID користувача-власника' })
  @IsInt()
  user_id: number;

  @ApiProperty({ description: 'Назва організації' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Опис діяльності' })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Статус верифікації',
    enum: verification_status_enum,
  })
  @IsOptional()
  @IsEnum(verification_status_enum)
  edrpou: string;
  description?: string;
  verification_status?: verification_status_enum;

  @ApiPropertyOptional({ description: 'Посилання на офіційні документи' })
  @IsOptional()
  @IsString()
  official_docs_url?: string;

  @ApiProperty({ description: 'Контактний телефон' })
  @IsString()
  contact_phone: string;

  @ApiProperty({ description: 'Контактна пошта' })
  @IsString()
  contact_email: string;

  @ApiPropertyOptional({ description: 'ID локації (міста)' })
  @IsOptional()
  @IsInt()
  contact_phone?: string;
  contact_email?: string;
  location_id?: number;
}
