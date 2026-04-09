import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { verification_status_enum } from '@prisma/client';

export class VerifyDecisionDto {
  @ApiProperty({ enum: ['VERIFIED', 'REJECTED'] })
  @IsEnum({ VERIFIED: 'VERIFIED', REJECTED: 'REJECTED' })
  status: verification_status_enum;

  @ApiPropertyOptional({ description: 'Причина відхилення (якщо REJECTED)' })
  @IsOptional()
  @IsString()
  reason?: string;
}
