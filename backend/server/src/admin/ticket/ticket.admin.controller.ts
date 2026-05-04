import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketAdminService } from './ticket.admin.service';
import { TicketQueryAdminDto } from './dto/ticket-query.admin.dto';
import { UpdateTicketStatusAdminDto } from './dto/update-ticket-status.admin.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum, ticket_status_enum, ticket } from '@prisma/client';
import {
  AbstractCrudController,
  IBaseCrudService,
} from '../../common/controllers/abstract-crud.controller';

@ApiTags('Адмін — Тікети')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/tickets')
export class TicketAdminController extends AbstractCrudController<ticket> {
  constructor(private readonly service: TicketAdminService) {
    super(service as unknown as IBaseCrudService<ticket>);
  }

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

  @Patch(':id/status')
  @ApiOperation({ summary: 'Змінити статус тікета' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTicketStatusAdminDto,
  ) {
    return this.service.updateStatus(id, dto.status);
  }

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі тікети (адмін)' })
  async getAll(@Query() query: TicketQueryAdminDto) {
    return this.service.findAll(query.limit, query.skip, query.search);
  }
}
