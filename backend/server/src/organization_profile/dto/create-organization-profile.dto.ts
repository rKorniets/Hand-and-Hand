import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsInt,
} from 'class-validator';

export class CreateOrganizationProfileDto {
  @ApiProperty({ description: 'Назва організації' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ЄДРПОУ (8 або 10 цифр)' })
  @IsString()
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
  official_docs_url?: string;

  @ApiProperty({ description: 'Контактний телефон' })
  @IsString()
  contact_phone: string;

  @ApiProperty({ description: 'Контактна пошта' })
  @IsEmail()
  contact_email: string;

  @ApiPropertyOptional({ description: 'ID локації (міста)' })
  @IsOptional()
  @IsInt()
  location_id?: number;
}
