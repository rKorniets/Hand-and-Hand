import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { user_role_enum, user_status_enum } from '@prisma/client';

export class CreateAppUserDto {
  @ApiProperty({ description: 'Електронна пошта користувача' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Хеш пароля' })
  @IsString()
  password_hash: string;

  @ApiProperty({ description: 'Роль користувача', enum: user_role_enum })
  @IsEnum(user_role_enum)
  role: user_role_enum;

  @ApiPropertyOptional({
    description: 'Статус акаунта',
    enum: user_status_enum,
  })
  @IsOptional()
  @IsEnum(user_status_enum)
  status?: user_status_enum;

  @ApiPropertyOptional({ description: 'Кількість балів' })
  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;
}
