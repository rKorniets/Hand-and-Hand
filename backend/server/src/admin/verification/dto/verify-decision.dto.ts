import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { verification_status_enum } from '@prisma/client';

export class VerifyDecisionDto {
  @ApiProperty({
    enum: [
      verification_status_enum.VERIFIED,
      verification_status_enum.REJECTED,
    ],
  })
  @IsEnum(verification_status_enum)
  status: verification_status_enum;

  @ApiPropertyOptional({ description: 'Причина відхилення (якщо REJECTED)' })
  @IsOptional()
  @IsString()
  reason?: string;
}
