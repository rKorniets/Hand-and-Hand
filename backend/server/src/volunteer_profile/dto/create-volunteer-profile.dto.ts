import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateVolunteerProfileDto {
  @ApiProperty({ description: 'ID користувача' })
  @IsInt()
  user_id: number;

  @ApiProperty({ description: 'Відображуване ім\'я' })
  @IsString()
  display_name: string;

  @ApiProperty({ description: 'Номер телефону' })
  @IsString()
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
