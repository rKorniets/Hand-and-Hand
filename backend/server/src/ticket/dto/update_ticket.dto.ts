import { PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from './create_ticket.dto';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}
