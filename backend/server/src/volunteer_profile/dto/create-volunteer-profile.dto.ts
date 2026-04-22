import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateVolunteerProfileDto {
  @ApiProperty({ description: 'ID користувача' })
  @IsInt()
  user_id: number;

  @ApiProperty({ description: "Відображуване ім'я" })
  @IsString()
  display_name: string;

  @ApiProperty({ description: 'Номер телефону' })
  @IsString()
  @Matches(/^\+?[\d\s\-()]{7,15}$/, {
    message: 'phone must be a valid phone number',
  })
  phone: string;

  @ApiProperty({ description: 'Біографія волонтера' })
  @IsString()
  bio: string;

  @ApiPropertyOptional({ description: 'Навички' })
  @IsOptional()
  @IsString()
  skills_text?: string;

  @ApiPropertyOptional({ description: 'Рейтинг' })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({ description: 'Чи верифікований профіль' })
  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;
}
