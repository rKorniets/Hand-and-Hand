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
import { CreateLocationDto } from '../../location/dto/create_location.dto';

export class CreateProjectDto {
  @ApiProperty()
  @IsInt()
  organization_profile_id: number;

  @ApiPropertyOptional({ description: 'ID категорії проєкту' })
  @IsOptional()
  @IsInt()
  category_id?: number;

  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsAfter } from '../../common/validators/is-after.validator';

export class CreateProjectDto {
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
  @MaxLength(255)
  time?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  application_deadline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  partners?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  image_url?: string;

  @ApiPropertyOptional({ enum: project_status_enum })
  @IsOptional()
  @IsEnum(project_status_enum)
  status?: project_status_enum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsDateString()
  starts_at?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsDateString()
  @IsAfter('starts_at')
  ends_at?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLocationDto)
  location?: CreateLocationDto;
}
