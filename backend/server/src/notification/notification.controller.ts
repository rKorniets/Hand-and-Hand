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
import {
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { user_role_enum } from '@prisma/client';
import { IsInt, IsPositive, IsString, IsEnum } from 'class-validator';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

enum NotifyTaskType {
  FUNDRAISER_CREATED = 'fundraiser_created',
  EVENT_CREATED = 'event_created',
}

class NotifyFromTaskDto {
  @ApiProperty({ example: 42, description: 'ID задачі (task)' })
  @IsInt()
  @IsPositive()
  task_id: number;

  @ApiProperty({ enum: NotifyTaskType })
  @IsEnum(NotifyTaskType)
  type: NotifyTaskType;

  @ApiProperty({ example: 7, description: 'ID створеного збору або події' })
  @IsInt()
  @IsPositive()
  source_id: number;

  @ApiProperty({ example: 'Допомога пораненим бійцям' })
  @IsString()
  title: string;
}

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

  @Patch(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Оновити сповіщення (тільки адмін)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, data);
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

  @Post('from-task')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({
    summary: 'Сповістити автора тікету про створення збору або події',
  })
  async notifyFromTask(
    @Body() dto: NotifyFromTaskDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.notificationService.notifyFromTask(dto, user);
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
