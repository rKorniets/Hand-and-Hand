import { IsInt, IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { warning_severity_enum } from '@prisma/client';

export class CreateWarningAdminDto {
  @ApiProperty({ description: 'ID of user receiving the warning' })
  @IsInt()
  user_id: number;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  reason: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  description: string;

  @ApiProperty({ enum: warning_severity_enum })
  @IsEnum(warning_severity_enum)
  severity: warning_severity_enum;

  @ApiPropertyOptional({ description: 'Warning expiration date' })
  @IsOptional()
  expires_at?: Date;

  @ApiPropertyOptional({ description: 'Related entity type (news, project, etc.)' })
  @IsOptional()
  @IsString()
  related_entity_type?: string;

  @ApiPropertyOptional({ description: 'Related entity ID' })
  @IsOptional()
  @IsInt()
  related_entity_id?: number;
}
