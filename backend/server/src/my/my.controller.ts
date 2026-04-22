import {
  Controller,
  Get,
  Query,
  ParseEnumPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { MyService } from './my.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { task_assignment_status_enum, user_role_enum } from '@prisma/client';

@ApiTags('My')
@ApiBearerAuth()
@Controller('my')
export class MyController {
  constructor(private readonly service: MyService) {}

  @Get('tasks')
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Мої завдання' })
  @ApiQuery({
    name: 'status',
    enum: task_assignment_status_enum,
    required: false,
  })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  async getMyTasks(
    @CurrentUser() user: { id: number },
    @Query(
      'status',
      new ParseEnumPipe(task_assignment_status_enum, { optional: true }),
    )
    status?: task_assignment_status_enum,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
  ) {
    return this.service.getMyTasks(user.id, status, limit, skip);
  }

  @Get('projects')
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Мої проєкти' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  async getMyProjects(
    @CurrentUser() user: { id: number },
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
  ) {
    return this.service.getMyProjects(user.id, limit, skip);
  }
  @Get('donations')
  @ApiOperation({ summary: 'Мої донати' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  async getMyDonations(
    @CurrentUser() user: { id: number },
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
  ) {
    return this.service.getMyDonations(user.id, limit, skip);
  }
  @Get('stats')
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Моя статистика' })
  async getMyStats(@CurrentUser() user: { id: number }) {
    return this.service.getMyStats(user.id);
  }
}
