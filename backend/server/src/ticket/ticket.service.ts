import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create_ticket.dto';
import { UpdateTicketDto } from './dto/update_ticket.dto';

export interface RequestUser {
  id: number;
}

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTicketDto, userId: number) {
    return this.prisma.ticket.create({
      data: {
        ...data,
        user_id: userId,
      },
    });

    if (!profile) {
      throw new NotFoundException('Volunteer profile not found');
    }

    if (profile.user_id !== currentUser.id) {
      throw new ForbiddenException('You can only create tickets on your own behalf');
    }

    return this.prisma.ticket.create({ data });
  }

  async findAll() {
    return this.prisma.ticket.findMany({
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
    return this.prisma.ticket.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.ticket.delete({
      where: { id },
    });
  }
}
