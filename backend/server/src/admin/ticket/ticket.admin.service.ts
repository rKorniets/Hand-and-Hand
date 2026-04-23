import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TicketQueryAdminDto } from './dto/ticket-query.admin.dto';
import { CreateTicketDto } from '../../ticket/dto/create_ticket.dto';
import { UpdateTicketDto } from '../../ticket/dto/update_ticket.dto';
import { Prisma, ticket_status_enum } from '@prisma/client';

@Injectable()
export class TicketAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    params: TicketQueryAdminDto & {
      limit?: number;
      skip?: number;
      search?: string;
    },
  ) {
    const whereClause: Prisma.ticketWhereInput = {
      ...(params.status && { status: params.status }),
      ...(params.priority && { priority: params.priority }),
      ...(params.search && {
        title: { contains: params.search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.ticket.findMany({
        where: whereClause,
        take: params.limit,
        skip: params.skip,
        orderBy: { created_at: 'desc' },
        include: {
          volunteer_profile: {
            select: { id: true, display_name: true },
          },
        },
      }),
      this.prisma.ticket.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        volunteer_profile: { select: { id: true, display_name: true } },
        location: true,
        task: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  // noinspection DuplicatedCode
  async create(data: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        ...(data.location_id !== undefined && {
          location_id: data.location_id,
        }),
      } as Prisma.ticketUncheckedCreateInput,
    });
  }

  // noinspection DuplicatedCode
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

  async updateStatus(id: number, status: ticket_status_enum) {
    await this.findOne(id);

    return this.prisma.ticket.update({
      where: { id },
      data: {
        status,
        ...(status === ticket_status_enum.CLOSED && { closed_at: new Date() }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.ticket.delete({ where: { id } });
  }
}
