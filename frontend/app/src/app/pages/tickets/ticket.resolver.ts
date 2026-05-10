import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TicketService } from './ticket.service';
import { TicketItem } from './ticket.model';

export const ticketResolver: ResolveFn<TicketItem[]> = () => {
  return inject(TicketService).getTickets(20, 0);
};
