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
import { user_role_enum, task_assignment } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('Task Assignments')
@ApiBearerAuth()
@Controller('task-assignments')
@SkipThrottle()
export class TaskAssignmentController extends AbstractCrudController<
  task_assignment[]
> {
  constructor(private readonly taskAssignmentService: TaskAssignmentService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        taskAssignmentService.findAll(
          limit,
          skip,
          undefined,
          undefined,
          search,
        ),
    } as unknown as IBaseCrudService<task_assignment[]>);
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
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
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Отримати список призначень' })
  @ApiQuery({
    name: 'taskId',
    required: false,
    type: Number,
    description: 'Фільтр за завданням',
  })
  @ApiQuery({
    name: 'volunteerId',
    required: false,
    type: Number,
    description: 'Фільтр за волонтером',
  })
  getTaskAssignments(
    @Query() query: PaginationDto,
    @Query('taskId', new ParseIntPipe({ optional: true })) taskId?: number,
    @Query('volunteerId', new ParseIntPipe({ optional: true }))
    volunteerId?: number,
  ) {
    return this.taskAssignmentService.findAll(
      query.limit ?? 10,
      query.skip ?? 0,
      taskId,
      volunteerId,
      query.search,
    );
  }

  @Get(':id')
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Отримати призначення за ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskAssignmentService.findOne(id);
  }

  @Put(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
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
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Видалити призначення (Відмовитись від завдання)' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.taskAssignmentService.remove(id, currentUser);
  }
}
