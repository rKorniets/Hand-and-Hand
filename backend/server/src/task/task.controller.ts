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
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create_task.dto';
import { UpdateTaskDto } from './dto/update_task.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Отримати список усіх задач' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати деталі задачі за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Створити нову задачу' })
  async create(@Body() data: CreateTaskDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Оновити існуючу задачу' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Видалити задачу' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
