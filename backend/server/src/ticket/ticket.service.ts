import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create_ticket.dto';
import { UpdateTicketDto } from './dto/update_ticket.dto';

export interface RequestUser {
  id: number;
}

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTicketDto, currentUser: RequestUser) {
    const profile = await this.prisma.volunteer_profile.findUnique({
      where: { id: data.volunteer_profile_id },
    });

    if (!profile) {
      throw new NotFoundException('Профіль волонтера не знайдено');
    }

    if (profile.user_id !== currentUser.id) {
      throw new ForbiddenException('Ви можете створювати тікети лише від свого імені');
    }

    return this.prisma.ticket.create({ data });
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
