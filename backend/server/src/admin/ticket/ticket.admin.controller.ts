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
import { UpdateTicketDto } from '../../ticket/dto/update_ticket.dto';
import { UpdateTicketStatusAdminDto } from './dto/update-ticket-status.admin.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum, ticket } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Адмін — Тікети')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/tickets')
export class TicketAdminController extends AbstractCrudController<ticket[]> {
  constructor(private readonly service: TicketAdminService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll({ limit, skip, search } as TicketQueryAdminDto),
    } as unknown as IBaseCrudService<ticket[]>);
  }

  @Get()
  @ApiOperation({ summary: 'Всі тікети підтримки' })
  async getTickets(
    @Query() paginationQuery: PaginationDto,
    @Query() ticketQuery: TicketQueryAdminDto,
  ) {
    return this.service.findAll({
      ...ticketQuery,
      limit: paginationQuery.limit ?? 10,
      skip: paginationQuery.skip ?? 0,
      search: paginationQuery.search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі тікета' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити тікет' })
  async create(@Body() data: CreateTicketDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити тікет' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTicketDto,
  ) {
    return this.service.update(id, data);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Змінити статус тікета' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTicketStatusAdminDto,
  ) {
    return this.service.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити тікет' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
