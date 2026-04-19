import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create_ticket.dto';
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
        ...data,
        user_id: userId,
      },
    });

    if (!profile) {
      throw new NotFoundException('Volunteer profile not found');
    }

    if (profile.user_id !== currentUser.id) {
      throw new ForbiddenException(
        'You can only create tickets on your own behalf',
      );
    }

    return this.prisma.ticket.create({ data });
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
}
