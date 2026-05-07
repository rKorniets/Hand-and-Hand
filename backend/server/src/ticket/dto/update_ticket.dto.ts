import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ticket_priority_enum } from '@prisma/client';

export class UpdateTicketDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ticket_priority_enum })
  @IsOptional()
  @IsEnum(ticket_priority_enum)
  priority?: ticket_priority_enum;
}
