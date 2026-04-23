import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { project_status_enum } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiPropertyOptional()
  @IsOptional()
  lat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  lng?: number;
}

export class CreateProjectDto {
  @ApiProperty()
  @IsInt()
  organization_profile_id: number;

  @ApiPropertyOptional({ description: 'ID категорії проєкту' })
  @IsOptional()
  @IsInt()
  category_id?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  main_content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  what_volunteers_will_do?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  why_its_important?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  application_deadline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  partners?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional({ enum: project_status_enum })
  @IsOptional()
  @IsEnum(project_status_enum)
  status?: project_status_enum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  starts_at?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ends_at?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLocationDto)
  location?: CreateLocationDto;
}
