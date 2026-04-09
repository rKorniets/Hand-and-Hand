import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateVolunteerProfileDto {
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
}
