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

  async create(data: CreateTicketDto, currentUser: RequestUser) {
    const profile = await this.prisma.volunteer_profile.findUnique({
      where: { id: data.volunteer_profile_id },
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
}
