import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { warning_status_enum, warning_severity_enum } from '@prisma/client';

export class WarningQueryAdminDto {
  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  user_id?: number;

  @ApiPropertyOptional({ enum: warning_status_enum })
  @IsOptional()
  @IsEnum(warning_status_enum)
  status?: warning_status_enum;

  @ApiPropertyOptional({ enum: warning_severity_enum })
  @IsOptional()
  @IsEnum(warning_severity_enum)
  severity?: warning_severity_enum;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;
}
