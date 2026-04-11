import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create_ticket.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
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

  //TODO: ownership — волонтер може редагувати/видаляти тільки свої тікети
  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Створити новий тікет від волонтера' })
  async create(
    @Body() data: CreateTicketDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.create(data, { id: user.id });
  }
}
