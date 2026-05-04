import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { user_role_enum } from '@prisma/client';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('Notifications')
@Controller('notifications')
@SkipThrottle()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримати мої сповіщення' })
  async getMyNotifications(@CurrentUser() user: { id: number }) {
    return this.notificationService.getMyNotifications(user);
  }

  @Get('unread-count')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Кількість непрочитаних сповіщень' })
  async getUnreadCount(@CurrentUser() user: { id: number }) {
    return this.notificationService.getUnreadCount(user);
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Створити сповіщення (тільки адмін)' })
  async create(@Body() data: CreateNotificationDto) {
    return this.notificationService.create(data);
  }

  @Patch(':id/read')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Позначити сповіщення як прочитане' })
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.notificationService.markAsRead(id, user);
  }

  @Patch('read-all')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Позначити всі сповіщення як прочитані' })
  async markAllAsRead(@CurrentUser() user: { id: number }) {
    return this.notificationService.markAllAsRead(user);
  }

  @Delete(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Видалити сповіщення' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.notificationService.delete(id, user);
  }
}
