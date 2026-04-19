import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create_task.dto';
import { UpdateTaskDto } from './dto/update_task.dto';
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

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController extends AbstractCrudController<unknown> {
  constructor(private readonly service: TaskService) {
    super(service as unknown as IBaseCrudService<unknown>);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Отримати список усіх задач' })
  async findAll(@Query() query: PaginationDto) {
    return this.service.findAll(
      query.limit ?? 5,
      query.skip ?? 0,
      query.search,
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати деталі задачі за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  //TODO: ownership — організація може створювати/редагувати/видаляти тільки задачі своїх проєктів
  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Створити нову задачу' })
  async create(
    @Body() data: CreateTaskDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.create(data, { id: user.id });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Оновити існуючу задачу' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.update(id, data, { id: user.id });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Видалити задачу' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.remove(id, { id: user.id });
  }
}
