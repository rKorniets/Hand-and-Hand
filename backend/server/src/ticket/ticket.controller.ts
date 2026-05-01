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
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create_ticket.dto';
import { UpdateTicketDto } from './dto/update_ticket.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface AuthenticatedUser {
  id: number;
  email: string;
}

@ApiTags('Тікети')
@Controller('tickets')
export class TicketController {
  constructor(private readonly service: TicketService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Створити новий тікет' })
  async create(
    @Body() data: CreateTicketDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.create(data, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі відкриті тікети' })
  async findAll(
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
    @Query('search') search?: string,
  ) {
    return this.service.findAll(limit, skip, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати тікет за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оновити тікет' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTicketDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Видалити тікет' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
