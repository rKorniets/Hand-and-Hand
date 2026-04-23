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
} from '@nestjs/common';
import { TaskAssignmentAdminService } from './task-assignment.admin.service';
import { CreateTaskAssignmentAdminDto } from './dto/create-task-assignment.admin.dto';
import { UpdateTaskAssignmentAdminDto } from './dto/update-task-assignment.admin.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum, task_assignment } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Адмін — Призначення на завдання')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/task-assignments')
export class TaskAssignmentAdminController extends AbstractCrudController<
  task_assignment[]
> {
  constructor(private readonly service: TaskAssignmentAdminService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll(limit, skip, undefined, undefined, search),
    } as unknown as IBaseCrudService<task_assignment[]>);
  }

  @Get()
  @ApiOperation({ summary: 'Список усіх призначень' })
  @ApiQuery({ name: 'taskId', required: false, type: String })
  @ApiQuery({ name: 'volunteerId', required: false, type: String })
  async getTaskAssignments(
    @Query() pagination: PaginationDto,
    @Query('taskId') taskIdStr?: string,
    @Query('volunteerId') volunteerIdStr?: string,
  ) {
    const taskId = taskIdStr ? parseInt(taskIdStr, 10) : undefined;
    const volunteerId = volunteerIdStr
      ? parseInt(volunteerIdStr, 10)
      : undefined;

    return this.service.findAll(
      pagination.limit ?? 10,
      pagination.skip ?? 0,
      taskId,
      volunteerId,
      pagination.search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі призначення' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити призначення' })
  async create(@Body() data: CreateTaskAssignmentAdminDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити призначення' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskAssignmentAdminDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити призначення' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
