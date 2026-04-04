import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create_ticket.dto';
import { UpdateTicketDto } from './dto/update_ticket.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketController {
  constructor(private readonly service: TicketService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Отримати список усіх тікетів' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати деталі тікету за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Створити новий тікет від волонтера' })
  async create(@Body() data: CreateTicketDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Оновити існуючий тікет' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTicketDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Видалити тікет' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
