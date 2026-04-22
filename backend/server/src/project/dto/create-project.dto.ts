import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { project_status_enum } from '@prisma/client';
import {
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
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiPropertyOptional({ enum: project_status_enum })
  @IsOptional()
  @IsEnum(project_status_enum)
  status?: project_status_enum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  starts_at?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  @IsAfter('starts_at')
  ends_at?: string;
}
