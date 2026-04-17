import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  approval_request_type_enum,
  approval_request_status_enum,
} from '@prisma/client';

export class ApprovalQueryDto {
  @ApiPropertyOptional({ enum: approval_request_type_enum })
  @IsOptional()
  @IsEnum(approval_request_type_enum)
  type?: approval_request_type_enum;

  @ApiPropertyOptional({ enum: approval_request_status_enum })
  @IsOptional()
  @IsEnum(approval_request_status_enum)
  status?: approval_request_status_enum;

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
