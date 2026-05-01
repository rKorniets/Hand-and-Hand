import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketAdminService } from './ticket.admin.service';
import { TicketQueryAdminDto } from './dto/ticket-query.admin.dto';
import { CreateTicketDto } from '../../ticket/dto/create_ticket.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum, ticket_status_enum } from '@prisma/client';

@ApiTags('Адмін — Тікети')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/tickets')
export class TicketAdminController {
  constructor(private readonly service: TicketAdminService) {}

  @Get('pending')
  @ApiOperation({ summary: 'Тікети на модерації' })
  async getPending() {
    return this.service.findPending();
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Прийняти тікет' })
  async approve(@Param('id', ParseIntPipe) id: number) {
    return this.service.updateStatus(id, ticket_status_enum.OPEN);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Відхилити тікет' })
  async reject(@Param('id', ParseIntPipe) id: number) {
    return this.service.updateStatus(id, ticket_status_enum.CANCELLED);
  }

  @Get()
  @ApiOperation({ summary: 'Всі тікети' })
  async findAll(@Query() query: TicketQueryAdminDto) {
    return this.service.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Створити тікет' })
  async create(@Body() data: CreateTicketDto, @Body('userId') userId: number) {
    return this.service.create(data, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити тікет' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
