import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';
import { TaskAdminService } from './task.admin.service';
import { CreateTaskDto } from '../../task/dto/create_task.dto';
import { UpdateTaskDto } from '../../task/dto/update_task.dto';

@ApiTags('Адмін — Задачі')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/tasks')
export class TaskAdminController {
  constructor(private readonly service: TaskAdminService) {}

  @Get()
  @ApiOperation({ summary: 'Список усіх задач' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі задачі' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити задачу' })
  async create(@Body() data: CreateTaskDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити задачу' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити задачу' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
