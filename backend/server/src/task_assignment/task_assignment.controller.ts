import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TaskAssignmentService } from './task_assignment.service';
import type { RequestUser } from './task_assignment.service';
import { CreateTaskAssignmentDto } from './dto/create_task_assignment.dto';
import { UpdateTaskAssignmentDto } from './dto/update_task_assignment.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Task Assignments')
@ApiBearerAuth()
@Controller('task-assignments')
export class TaskAssignmentController {
  constructor(private readonly taskAssignmentService: TaskAssignmentService) {}

  @Post()
  @Roles(user_role_enum.ADMIN, user_role_enum.VOLUNTEER)
  @ApiOperation({
    summary: 'Створити призначення на завдання (Взяти в роботу)',
  })
  create(
    @Body() createTaskAssignmentDto: CreateTaskAssignmentDto,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.taskAssignmentService.create(
      createTaskAssignmentDto,
      currentUser,
    );
  }

  @Get()
  @Roles(
    user_role_enum.ADMIN,
    user_role_enum.ORGANIZATION,
    user_role_enum.VOLUNTEER,
  )
  @ApiOperation({ summary: 'Отримати список призначень' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({
    name: 'taskId',
    required: false,
    description: 'Фільтр за завданням',
  })
  @ApiQuery({
    name: 'volunteerId',
    required: false,
    description: 'Фільтр за волонтером',
  })
  findAll(
    @Query('limit') limitStr?: string,
    @Query('skip') skipStr?: string,
    @Query('taskId') taskIdStr?: string,
    @Query('volunteerId') volunteerIdStr?: string,
  ) {
    const limit = limitStr ? parseInt(limitStr, 10) : 10;
    const skip = skipStr ? parseInt(skipStr, 10) : 0;
    const taskId = taskIdStr ? parseInt(taskIdStr, 10) : undefined;
    const volunteerId = volunteerIdStr
      ? parseInt(volunteerIdStr, 10)
      : undefined;

    return this.taskAssignmentService.findAll(limit, skip, taskId, volunteerId);
  }

  @Get(':id')
  @Roles(
    user_role_enum.ADMIN,
    user_role_enum.ORGANIZATION,
    user_role_enum.VOLUNTEER,
  )
  @ApiOperation({ summary: 'Отримати призначення за ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskAssignmentService.findOne(id);
  }

  @Put(':id')
  @Roles(user_role_enum.ADMIN, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Оновити статус або додати коментар' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskAssignmentDto: UpdateTaskAssignmentDto,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.taskAssignmentService.update(
      id,
      updateTaskAssignmentDto,
      currentUser,
    );
  }

  @Delete(':id')
  @Roles(user_role_enum.ADMIN, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Видалити призначення (Відмовитись від завдання)' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.taskAssignmentService.remove(id, currentUser);
  }
}
