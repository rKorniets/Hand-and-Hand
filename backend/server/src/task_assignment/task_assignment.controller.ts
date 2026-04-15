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
  @Roles(user_role_enum.VOLUNTEER)
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
    const DEFAULT_LIMIT = 10;
    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;

    const parsedLimit: number = limitStr
      ? parseInt(limitStr, 10)
      : DEFAULT_LIMIT;
    const normalizedLimit: number = Number.isNaN(parsedLimit)
      ? DEFAULT_LIMIT
      : Math.min(Math.max(parsedLimit, MIN_LIMIT), MAX_LIMIT);

    const DEFAULT_SKIP = 0;
    const MIN_SKIP = 0;

    const parsedSkip: number = skipStr ? parseInt(skipStr, 10) : DEFAULT_SKIP;
    const normalizedSkip: number = Number.isNaN(parsedSkip)
      ? DEFAULT_SKIP
      : Math.max(parsedSkip, MIN_SKIP);

    const taskId =
      taskIdStr && !Number.isNaN(parseInt(taskIdStr, 10))
        ? parseInt(taskIdStr, 10)
        : undefined;

    const volunteerId =
      volunteerIdStr && !Number.isNaN(parseInt(volunteerIdStr, 10))
        ? parseInt(volunteerIdStr, 10)
        : undefined;

    return this.taskAssignmentService.findAll(
      normalizedLimit,
      normalizedSkip,
      taskId,
      volunteerId,
    );
  }

  @Get(':id')
  @Roles(
    user_role_enum.ORGANIZATION,
    user_role_enum.VOLUNTEER,
  )
  @ApiOperation({ summary: 'Отримати призначення за ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskAssignmentService.findOne(id);
  }

  @Put(':id')
  @Roles(user_role_enum.VOLUNTEER)
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
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Видалити призначення (Відмовитись від завдання)' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.taskAssignmentService.remove(id, currentUser);
  }
}
