import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TicketQueryAdminDto } from './dto/ticket-query.admin.dto';
import { CreateTicketDto } from '../../ticket/dto/create_ticket.dto';
import { Prisma, ticket_status_enum } from '@prisma/client';

@Injectable()
export class TicketAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findPending() {
    return this.prisma.ticket.findMany({
      where: { status: ticket_status_enum.IN_REVIEW },
      include: {
        app_user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
        location: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findAll(limit?: number, skip?: number, search?: string) {
    return this.prisma.ticket.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      take: limit,
      skip,
      orderBy: { created_at: 'desc' },
      include: {
        app_user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
        location: true,
      },
    });
  }

  async findAllAdvanced(params: TicketQueryAdminDto) {
    const { limit, skip, status, priority, search } = params;

    const where: Prisma.ticketWhereInput = {
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.ticket.findMany({
        where,
        take: limit,
        skip,
        include: {
          app_user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
          location: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        app_user: {
          select: { id: true, email: true, first_name: true, last_name: true },
        },
        location: true,
      },
    });

    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);
    return ticket;
  }

  async create(data: CreateTicketDto, userId: number) {
    return this.prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        status: ticket_status_enum.IN_REVIEW,
        priority: data.priority || 'MEDIUM',
        file_url: data.file_url,
        app_user: { connect: { id: userId } },
        ...(data.location && {
          location: {
            create: {
              city: data.location.city,
              address: data.location.address,
              region: data.location.region,
              lat: data.location.lat,
              lng: data.location.lng,
            },
          },
        }),
      },
    });
  }

  async updateStatus(id: number, status: ticket_status_enum) {
    await this.findOne(id);
    return this.prisma.ticket.update({
      where: { id },
      data: {
        status,
        updated_at: new Date(),
        ...((status === ticket_status_enum.CLOSED ||
          status === ticket_status_enum.CANCELLED) && {
          closed_at: new Date(),
        }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.ticket.delete({ where: { id } });
  }
}
