import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ApprovalRequestType {
  NEWS = 'NEWS',
  PROJECT = 'PROJECT',
  VOLUNTEER = 'VOLUNTEER',
  ORGANIZATION = 'ORGANIZATION',
  FUNDRAISING = 'FUNDRAISING',
}

export enum ApprovalRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class ApprovalQueryDto {
  @ApiPropertyOptional({ enum: ApprovalRequestType })
  @IsOptional()
  @IsEnum(ApprovalRequestType)
  type?: ApprovalRequestType;

  @ApiPropertyOptional({ enum: ApprovalRequestStatus })
  @IsOptional()
  @IsEnum(ApprovalRequestStatus)
  status?: ApprovalRequestStatus;

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
