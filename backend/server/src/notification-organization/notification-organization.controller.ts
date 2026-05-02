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
import { NotificationOrganizationService } from './notification-organization.service';
import { CreateOrgNotificationDto } from './dto/create-notification-organization.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Organization Notifications')
@Controller('notifications/org')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationOrganizationController {
  constructor(
    private readonly notificationService: NotificationOrganizationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Отримати сповіщення моєї організації' })
  getOrgNotifications(@CurrentUser() user: { organizationId: number }) {
    return this.notificationService.getByOrgId(user.organizationId);
  }

  @Patch('read-all')
  @ApiOperation({
    summary: 'Позначити всі сповіщення організації як прочитані',
  })
  markAllAsRead(@CurrentUser() user: { organizationId: number }) {
    return this.notificationService.markAllAsRead(user.organizationId);
  }

  @Post()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({
    summary: 'Створити сповіщення для організації (тільки адмін)',
  })
  create(@Body() data: CreateOrgNotificationDto) {
    return this.notificationService.create(data);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Позначити сповіщення організації як прочитане' })
  markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { organizationId: number },
  ) {
    return this.notificationService.markAsRead(id, user.organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити сповіщення організації' })
  delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { organizationId: number },
  ) {
    return this.notificationService.delete(id, user.organizationId);
  }
}
