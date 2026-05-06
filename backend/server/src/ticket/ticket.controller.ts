import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Req,
  Put,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create_ticket.dto';
import { UpdateTicketDto } from './dto/update_ticket.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { user_role_enum, ticket } from '@prisma/client';
import {
  AbstractCrudController,
  IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

type RequestWithUser = {
  user: {
    id: number;
    role: user_role_enum;
  };
};

@ApiTags('Tickets')
@Controller('tickets')
@SkipThrottle()
export class TicketController extends AbstractCrudController<ticket[]> {
  constructor(private readonly service: TicketService) {
    super(service as unknown as IBaseCrudService<ticket[]>);
  }

  @Get(':id')
  @SkipThrottle()
  @Public()
  @ApiOperation({ summary: 'Отримати деталі тікету за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.APP_USER, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Створити новий тікет' })
  async create(@Body() data: CreateTicketDto, @Req() req: RequestWithUser) {
    return this.service.create(data, req.user.id);
  }

  @Patch(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.APP_USER, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Оновити тікет' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTicketDto,
    @Req() req: RequestWithUser,
  ) {
    return this.service.update(id, data, req.user.id);
  }
  @Put(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.APP_USER, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Повне оновлення тікету' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateTicketDto,
    @Req() req: RequestWithUser,
  ) {
    return this.service.updateFull(id, data, req.user.id);
  }
  @Delete(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
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
    return this.service.remove(id, req.user.id, req.user.role);
  }
}
