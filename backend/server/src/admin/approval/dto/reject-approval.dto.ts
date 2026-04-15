import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RejectApprovalDto {
  @ApiProperty({ description: 'Причина відхилення' })
  @IsString()
  @MinLength(5)
  reason: string;
}
