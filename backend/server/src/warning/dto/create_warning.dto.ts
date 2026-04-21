import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { warning_status_enum, warning_severity_enum } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class Create_warningDto {
  @ApiProperty({
    description: 'ID користувача якому видається попередження',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  user_id: number;

  @ApiProperty({
    description: 'ID користувача який створив попередження',
    example: 1,
  })
  created_by: number;

  @ApiProperty({
    description: 'Причина попередження',
    example: 'Порушення правил',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  reason: string;

  @ApiProperty({
    description: 'Детальний опис',
    example: 'Користувач порушив правила платформи',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(10000)
  description: string;

  @ApiPropertyOptional({
    enum: warning_severity_enum,
    default: warning_severity_enum.MEDIUM,
  })
  @IsOptional()
  @IsEnum(warning_severity_enum)
  severity?: warning_severity_enum;

  @ApiPropertyOptional({
    enum: warning_status_enum,
    default: warning_status_enum.ACTIVE,
  })
  @IsOptional()
  @IsEnum(warning_status_enum)
  status?: warning_status_enum;

  @ApiPropertyOptional({
    description: 'Дата закінчення попередження',
    example: '2025-06-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  expires_at?: string;

  @ApiPropertyOptional({
    description: "Тип пов'язаної сутності",
    example: 'ticket',
  })
  @IsOptional()
  @IsString()
  related_entity_type?: string;

  @ApiPropertyOptional({
    description: "ID пов'язаної сутності",
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  related_entity_id?: number;
}
