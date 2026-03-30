import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { warning_status_enum, warning_severity_enum } from '@prisma/client';

export class Create_warningDto {
  @ApiProperty({
    description: 'ID користувача якому видається попередження',
    example: 1,
  })
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
  reason: string;

  @ApiProperty({
    description: 'Детальний опис',
    example: 'Користувач порушив правила платформи',
  })
  description: string;

  @ApiPropertyOptional({
    enum: warning_status_enum,
    default: warning_status_enum.ACTIVE,
  })
  status?: warning_status_enum;

  @ApiPropertyOptional({
    enum: warning_severity_enum,
    default: warning_severity_enum.MEDIUM,
  })
  severity?: warning_severity_enum;

  @ApiPropertyOptional({
    description: 'Дата закінчення попередження',
    example: '2025-06-01T00:00:00.000Z',
  })
  expires_at?: Date;

  @ApiPropertyOptional({
    description: "Тип пов'язаної сутності",
    example: 'ticket',
  })
  related_entity_type?: string;

  @ApiPropertyOptional({
    description: "ID пов'язаної сутності",
    example: 5,
  })
  related_entity_id?: number;
}
