import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { verification_status_enum } from '@prisma/client';

export class CreateOrganizationProfileDto {
  @ApiProperty({ description: 'ID користувача-власника' })
  @IsInt()
  user_id: number;

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

  @ApiPropertyOptional({
    description: 'Статус верифікації',
    enum: verification_status_enum,
    default: verification_status_enum,
  })
  @IsOptional()
  @IsEnum(verification_status_enum)
  verification_status?: verification_status_enum;

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
