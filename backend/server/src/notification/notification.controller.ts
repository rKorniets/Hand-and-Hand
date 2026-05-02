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

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримати мої сповіщення' })
  getMyNotifications(@CurrentUser() user: { id: number }) {
    return this.notificationService.getMyNotifications(user);
  }

  @Get('unread-count')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Кількість непрочитаних сповіщень' })
  getUnreadCount(@CurrentUser() user: { id: number }) {
    return this.notificationService.getUnreadCount(user);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Створити сповіщення (тільки адмін)' })
  create(@Body() data: CreateNotificationDto) {
    return this.notificationService.create(data);
  }

  @Patch(':id/read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Позначити сповіщення як прочитане' })
  markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.notificationService.markAsRead(id, user);
  }

  @Patch('read-all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Позначити всі сповіщення як прочитані' })
  markAllAsRead(@CurrentUser() user: { id: number }) {
    return this.notificationService.markAllAsRead(user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Видалити сповіщення' })
  delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.notificationService.delete(id, user);
  }

  @Get('org')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримати сповіщення моєї організації' })
  getOrgNotifications(@CurrentUser() user: { organizationId: number }) {
    return this.notificationService.getOrgNotifications(user.organizationId);
  }

  @Patch('org/:id/read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Прочитати сповіщення організації' })
  markOrgAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { organizationId: number },
  ) {
    return this.notificationService.markOrgAsRead(id, user.organizationId);
  }

  @Patch('org/read-all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Прочитати всі сповіщення організації' })
  markAllOrgAsRead(@CurrentUser() user: { organizationId: number }) {
    return this.notificationService.markAllOrgAsRead(user.organizationId);
  }

  @Delete('org/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Видалити сповіщення організації' })
  deleteOrg(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { organizationId: number },
  ) {
    return this.notificationService.deleteOrgNotification(
      id,
      user.organizationId,
    );
  }
}
