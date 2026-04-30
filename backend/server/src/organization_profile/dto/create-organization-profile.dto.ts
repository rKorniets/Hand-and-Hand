import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';

export class CreateOrganizationProfileDto {
  @ApiProperty({ description: 'Назва організації' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ЄДРПОУ' })
  @IsString()
  @Matches(/^\d{8}$/, { message: 'ЄДРПОУ must be exactly 8 digits' })
  edrpou: string;

  @ApiProperty({ description: 'Опис діяльності' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Місія організації' })
  @IsString()
  mission: string;

  @ApiPropertyOptional({ description: 'Посилання на офіційні документи' })
  @IsOptional()
  @IsString()
  @IsUrl()
  official_docs_url?: string;

  @ApiProperty({ description: 'Контактний телефон' })
  @IsString()
  @Matches(/^\+?[\d\s\-()]{7,15}$/, {
    message: 'contact_phone must be a valid phone number',
  })
  contact_phone: string;

  @ApiProperty({ description: 'Контактна пошта' })
  @IsEmail()
  contact_email: string;

  @ApiPropertyOptional({ description: 'ID локації (міста)' })
  @IsOptional()
  @IsInt()
  location_id?: number;
  @ApiPropertyOptional({ description: 'URL логотипу організації' })
  @IsOptional()
  @IsUrl()
  logo_url?: string;
}
