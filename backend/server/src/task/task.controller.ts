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
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create_task.dto';
import { UpdateTaskDto } from './dto/update_task.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { user_role_enum, task } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('Tasks')
@Controller('tasks')
@SkipThrottle()
export class TaskController extends AbstractCrudController<task[]> {
  constructor(private readonly service: TaskService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll(limit, skip, search),
    } as unknown as IBaseCrudService<task[]>);
  }

  @Get()
  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Отримати список усіх задач' })
  async getTasks(@Query() query: PaginationDto) {
    return this.service.findAll(
      query.limit ?? 5,
      query.skip ?? 0,
      query.search,
    );
  }

  @Get(':id')
  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Отримати деталі задачі за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
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
  @Throttle({ default: { limit: 10, ttl: 60000 } })
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
  @Throttle({ default: { limit: 10, ttl: 60000 } })
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
