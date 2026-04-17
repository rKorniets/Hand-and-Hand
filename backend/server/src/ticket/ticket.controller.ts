import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create_ticket.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { user_role_enum } from '@prisma/client';

type RequestWithUser = {
  user: {
    sub: number;
    role: string;
  };
};
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
  @Roles(user_role_enum.APP_USER, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Створити новий тікет від волонтера' })
  async create(@Body() data: CreateTicketDto, @Req() req: RequestWithUser) {
    return this.service.create(data, req.user.sub);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.APP_USER, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Оновити існуючий тікет' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTicketDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    const ticket = await this.service.findOne(id);
    if (!ticket || ticket.user_id !== userId) {
      throw new ForbiddenException('Ви можете редагувати тільки власні запити');
    }
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(
    user_role_enum.APP_USER,
    user_role_enum.VOLUNTEER,
    user_role_enum.ADMIN,
  )
  @ApiOperation({ summary: 'Видалити тікет' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    const ticket = await this.service.findOne(id);
    if (!ticket) {
      throw new ForbiddenException('Тікет не знайдено');
    }
    if (userRole !== user_role_enum.ADMIN && ticket.user_id !== userId) {
      throw new ForbiddenException(
        'У вас немає прав на видалення цього запиту',
      );
    }

    return this.service.remove(id);
  }
}
