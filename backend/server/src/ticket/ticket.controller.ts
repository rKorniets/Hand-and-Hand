import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create_ticket.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { user_role_enum } from '@prisma/client';
import {
  AbstractCrudController,
  IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketController extends AbstractCrudController<unknown> {
  constructor(private readonly service: TicketService) {
    super(service as unknown as IBaseCrudService<unknown>);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Отримати список усіх тікетів' })
  async findAll(@Query() query: PaginationDto) {
    return this.service.findAll(
      query.limit ?? 5,
      query.skip ?? 0,
      query.search,
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати деталі тікету за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  //TODO: ownership — волонтер може редагувати/видаляти тільки свої тікети
  //TODO: volunteer_profile_id має визначатися з JWT токена, а не передаватися в DTO
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
