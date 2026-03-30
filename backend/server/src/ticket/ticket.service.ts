import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create_ticket.dto';
import { UpdateTicketDto } from './dto/update_ticket.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTicketDto) {
    return this.prisma.ticket.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.ticket.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        volunteer_profile: true,
        location: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: {
        volunteer_profile: true,
        location: true,
        task: true,
      },
    });
  }

  async update(id: number, data: UpdateTicketDto) {
    const updateData: Prisma.ticketUpdateInput = { ...data };

    if (data.status === 'CLOSED' || data.status === 'CANCELLED') {
      updateData.closed_at = new Date();
    }

    return this.prisma.ticket.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    return this.prisma.ticket.delete({
      where: { id },
    });
  }
}
