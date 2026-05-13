import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  notification_type_enum,
  ticket_status_enum,
  Prisma,
} from '@prisma/client';
import { AppGateway } from '../websocket/app.gateway';

export interface RequestUser {
  id: number;
}

export interface NotifyFromTaskDto {
  task_id: number;
  type: 'fundraiser_created' | 'event_created';
  source_id: number;
  title: string;
}

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private appGateway: AppGateway,
  ) {}

  async findAll(
    userId: number,
    limit: number = 5,
    skip: number = 0,
    search?: string,
  ) {
    const whereClause: Prisma.notificationWhereInput = {
      user_id: userId,
      ...(search && {
        message: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.notification.count({
        where: whereClause,
      }),
    ]);

    return { data, total };
  }

  async getUnreadCount(currentUser: RequestUser) {
    const count = await this.prisma.notification.count({
      where: { user_id: currentUser.id, is_read: false },
    });
    return { count };
  }

  async markAsRead(id: number, currentUser: RequestUser) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    if (notification.user_id !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have permission to access this notification',
      );
    }

    return this.prisma.notification.update({
      where: { id },
      data: { is_read: true },
    });
  }

  async markAllAsRead(currentUser: RequestUser) {
    return this.prisma.notification.updateMany({
      where: { user_id: currentUser.id, is_read: false },
      data: { is_read: true },
    });
  }

  async create(data: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        user_id: data.user_id,
        message: data.message,
        type: data.type ?? notification_type_enum.GENERAL,
      },
    });

    this.appGateway.sendToUser(data.user_id, 'newNotification', notification);

    return notification;
  }

  async notifyFromTask(dto: NotifyFromTaskDto, currentUser: RequestUser) {
    const task = await this.prisma.task.findUnique({
      where: { id: dto.task_id },
      include: {
        ticket: {
          select: { id: true, user_id: true },
        },
        project: {
          select: {
            organization_profile: {
              select: { name: true, user_id: true },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${dto.task_id} not found`);
    }

    const orgUserId = task.project?.organization_profile?.user_id;
    if (orgUserId !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have permission to notify from this task',
      );
    }

    if (!task.ticket || !task.ticket.user_id) {
      throw new BadRequestException(
        'Task has no linked ticket or ticket has no author',
      );
    }

    const recipientUserId = task.ticket.user_id;
    const ticketId = task.ticket.id;
    const orgName = task.project?.organization_profile?.name ?? 'Організація';

    const linkMap: Record<NotifyFromTaskDto['type'], string> = {
      fundraiser_created: `/fundraising/${dto.source_id}`,
      event_created: `/events/${dto.source_id}`,
    };

    const messageMap: Record<NotifyFromTaskDto['type'], string> = {
      fundraiser_created: `${orgName} відгукнулася на вашу заявку та створила збір коштів «${dto.title}».`,
      event_created: `${orgName} відгукнулася на вашу заявку та створила подію «${dto.title}».`,
    };

    return this.prisma.$transaction(async (tx) => {
      const notification = await tx.notification.create({
        data: {
          user_id: recipientUserId,
          message: messageMap[dto.type],
          link: linkMap[dto.type],
          type: notification_type_enum.TICKET,
        },
      });

      const resolvedAt = new Date();

      await tx.ticket.update({
        where: { id: ticketId },
        data: {
          status: ticket_status_enum.RESOLVED,
          closed_at: resolvedAt,
          updated_at: resolvedAt,
        },
      });

      return notification;
    });
  }

  async update(id: number, data: UpdateNotificationDto) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return this.prisma.notification.update({
      where: { id },
      data: {
        ...(data.user_id && { user_id: data.user_id }),
        ...(data.message && { message: data.message }),
        ...(data.type && { type: data.type }),
      },
    });
  }

  async delete(id: number, currentUser: RequestUser) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    if (notification.user_id !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this notification',
      );
    }

    return this.prisma.notification.delete({ where: { id } });
  }
}
