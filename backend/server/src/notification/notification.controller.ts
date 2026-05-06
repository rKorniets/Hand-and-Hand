import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { user_role_enum } from '@prisma/client';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@Controller('notifications')
@SkipThrottle()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('unread-count')
  @ApiOperation({ summary: 'Кількість непрочитаних сповіщень' })
  async getUnreadCount(@CurrentUser() user: { id: number }) {
    return this.notificationService.getUnreadCount(user);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати мої сповіщення' })
  async getMyNotifications(@CurrentUser() user: { id: number }) {
    return this.notificationService.getMyNotifications(user);
  }

  @Patch('read-all')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Позначити всі сповіщення як прочитані' })
  async markAllAsRead(@CurrentUser() user: { id: number }) {
    return this.notificationService.markAllAsRead(user);
  }

  @Patch(':id/read')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Позначити сповіщення як прочитане' })
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.notificationService.markAsRead(id, user);
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Створити сповіщення (тільки адмін)' })
  async create(@Body() data: CreateNotificationDto) {
    return this.notificationService.create(data);
  }

  @Delete(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Видалити сповіщення' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.notificationService.delete(id, user);
  }
}
