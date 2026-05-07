import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create_ticket.dto';
import { UpdateTicketDto } from './dto/update_ticket.dto';
import { Prisma, ticket_status_enum, user_role_enum } from '@prisma/client';

interface LocationData {
  city: string;
  address: string;
  region: string;
  lat?: number;
  lng?: number;
}

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  private async findOrCreateLocation(
    tx: Prisma.TransactionClient,
    location: LocationData,
  ): Promise<number> {
    const existing = await tx.location.findFirst({
      where: {
        city: location.city,
        address: location.address,
        region: location.region,
      },
      select: { id: true },
    });

    if (existing) return existing.id;

    const created = await tx.location.create({
      data: {
        city: location.city,
        address: location.address,
        region: location.region,
        lat: location.lat ?? null,
        lng: location.lng ?? null,
      },
    });

    return created.id;
  }

  async create(data: CreateTicketDto, userId: number) {
    if (!userId) {
      throw new BadRequestException('User ID is required to create a ticket');
    }

    return this.prisma.$transaction(async (tx) => {
      let locationId: number | undefined;

      if (data.location) {
        locationId = await this.findOrCreateLocation(
          tx,
          data.location as LocationData,
        );
      }

      return tx.ticket.create({
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority || 'MEDIUM',
          status: ticket_status_enum.IN_REVIEW,
          app_user: {
            connect: { id: userId },
          },
          ...(locationId && {
            location: { connect: { id: locationId } },
          }),
          ...(data.file_url && { file_url: data.file_url }),
        },
      });
    });
  }

  async findAll(limit?: number, skip?: number, search?: string) {
    const where: Prisma.ticketWhereInput = {
      status: ticket_status_enum.OPEN,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    return this.prisma.ticket.findMany({
      where,
      take: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
      orderBy: { created_at: 'desc' },
      include: {
        location: true,
        app_user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
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
            email: true,
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

  async update(id: number, data: UpdateTicketDto, userId: number) {
    const ticket = await this.findOne(id);

    if (ticket.user_id !== userId) {
      throw new ForbiddenException('Ви можете редагувати тільки власні тікети');
    }

    return this.prisma.ticket.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.priority !== undefined && { priority: data.priority }),
        updated_at: new Date(),
      },
    });
  }

  async remove(id: number, userId: number, userRole: user_role_enum) {
    const ticket = await this.findOne(id);

    if (userRole !== user_role_enum.ADMIN && ticket.user_id !== userId) {
      throw new ForbiddenException(
        'У вас немає прав на видалення цього тікету',
      );
    }

    return this.prisma.ticket.delete({ where: { id } });
  }
}
