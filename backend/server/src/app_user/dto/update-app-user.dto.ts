import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateAppUserDto {
  @ApiPropertyOptional({ description: 'Електронна пошта' })
  @IsOptional()
  @IsEmail()
  email?: string;

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

  @ApiPropertyOptional({ description: 'URL аватара' })
  @IsOptional()
  @IsUrl()
  avatar_url?: string;
}
