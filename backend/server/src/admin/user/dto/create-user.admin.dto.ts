import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { user_role_enum } from '@prisma/client';

export class CreateUserAdminDto {
  @ApiProperty({ description: 'Електронна пошта' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Пароль (мін. 6 символів)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Роль користувача', enum: user_role_enum })
  @IsEnum(user_role_enum)
  role: user_role_enum;

  @ApiPropertyOptional({ description: "Ім'я" })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiPropertyOptional({ description: 'Прізвище' })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional({ description: 'Місто' })
  @IsOptional()
  @IsString()
  city?: string;
}
