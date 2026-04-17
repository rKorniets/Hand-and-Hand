import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ticket_status_enum } from '@prisma/client';

export class UpdateTicketStatusAdminDto {
  @ApiProperty({ enum: ticket_status_enum })
  @IsEnum(ticket_status_enum)
  status: ticket_status_enum;
}
