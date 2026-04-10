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
import { CreateTaskAssignmentDto } from '../../task_assignment/dto/create_task_assignment.dto';
import { UpdateTaskAssignmentDto } from '../../task_assignment/dto/update_task_assignment.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Admin — Task Assignments')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/task-assignments')
export class TaskAssignmentAdminController {
  constructor(private readonly service: TaskAssignmentAdminService) {}

  @Get()
  @ApiOperation({ summary: 'List all task assignments' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'taskId', required: false })
  @ApiQuery({ name: 'volunteerId', required: false })
  async findAll(
    @Query('limit') limitStr?: string,
    @Query('skip') skipStr?: string,
    @Query('taskId') taskIdStr?: string,
    @Query('volunteerId') volunteerIdStr?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '10', 10) || 10, 1), 50);
    const skip = Math.max(parseInt(skipStr ?? '0', 10) || 0, 0);
    const taskId = taskIdStr ? parseInt(taskIdStr, 10) : undefined;
    const volunteerId = volunteerIdStr ? parseInt(volunteerIdStr, 10) : undefined;

    return this.service.findAll(limit, skip, taskId, volunteerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task assignment details' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create task assignment' })
  async create(@Body() data: CreateTaskAssignmentDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task assignment' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskAssignmentDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task assignment' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
