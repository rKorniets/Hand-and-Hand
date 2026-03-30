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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список усіх задач' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати деталі задачі за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити нову задачу' })
  async create(@Body() data: CreateTaskDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити існуючу задачу' })
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
