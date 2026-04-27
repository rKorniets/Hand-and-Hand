import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create_ticket.dto';
import { UpdateTicketDto } from './dto/update_ticket.dto';
import { Prisma } from '@prisma/client';

export interface RequestUser {
  id: number;
}

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTicketDto, userId: number) {
    return this.prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        ...(data.location_id !== undefined && {
          location_id: data.location_id,
        }),
        user_id: userId,
      },
    });
  }

  async findAll(limit?: number, skip?: number, search?: string) {
    const where: Prisma.ticketWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return this.prisma.ticket.findMany({
      where,
      take: limit,
      skip: skip,
      orderBy: { created_at: 'desc' },
      include: {
        location: true,
        app_user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        app_user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            role: true,
          },
        },
        location: true,
        task: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Тікет з ID ${id} не знайдено`);
    }

    return ticket;
  }

  async update(id: number, data: UpdateTicketDto) {
    await this.findOne(id);

    return this.prisma.ticket.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.location_id !== undefined && {
          location_id: data.location_id,
        }),
        updated_at: new Date(),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.ticket.delete({ where: { id } });
  }
}
