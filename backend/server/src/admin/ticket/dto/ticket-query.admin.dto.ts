import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ticket_status_enum, ticket_priority_enum } from '@prisma/client';

export class TicketQueryAdminDto {
  @ApiPropertyOptional({ enum: ticket_status_enum })
  @IsOptional()
  @IsEnum(ticket_status_enum)
  status?: ticket_status_enum;

  @ApiPropertyOptional({ enum: ticket_priority_enum })
  @IsOptional()
  @IsEnum(ticket_priority_enum)
  priority?: ticket_priority_enum;

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
