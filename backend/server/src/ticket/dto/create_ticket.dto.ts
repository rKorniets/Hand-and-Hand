import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ticket_status_enum, ticket_priority_enum } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({
    description: 'Короткий заголовок тікету',
    example: 'Потрібна машина для доставки',
  })
  title: string;

  @ApiProperty({ description: 'Детальний опис проблеми' })
  description: string;

  @ApiPropertyOptional({
    enum: ticket_status_enum,
    default: ticket_status_enum.OPEN,
  })
  status?: ticket_status_enum;

  @ApiPropertyOptional({
    enum: ticket_priority_enum,
    default: ticket_priority_enum.MEDIUM,
  })
  priority?: ticket_priority_enum;

  @ApiPropertyOptional({
    description: "ID локації (якщо тікет прив'язаний до місця)",
    example: 5,
  })
  location_id?: number;
}
