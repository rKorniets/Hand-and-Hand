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
import { MyOrgService } from './my-org.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { project_status_enum, user_role_enum } from '@prisma/client';

@ApiTags('My Organization')
@ApiBearerAuth()
@Roles(user_role_enum.ORGANIZATION)
@Controller('my-org')
export class MyOrgController {
  constructor(private readonly service: MyOrgService) {}

  @Get('projects')
  @ApiOperation({ summary: 'Мої події' })
  @ApiQuery({ name: 'status', enum: project_status_enum, required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  async getMyProjects(
    @CurrentUser() user: { id: number },
    @Query('status', new ParseEnumPipe(project_status_enum, { optional: true }))
    status?: project_status_enum,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
  ) {
    return this.service.getMyProjects(user.id, status, limit, skip);
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Всі таски з моїх подій' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  async getMyTasks(
    @CurrentUser() user: { id: number },
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
  ) {
    return this.service.getMyTasks(user.id, limit, skip);
  }

  @Get('volunteers')
  @ApiOperation({ summary: 'Волонтери на моїх подіях' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  async getMyVolunteers(
    @CurrentUser() user: { id: number },
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
  ) {
    return this.service.getMyVolunteers(user.id, limit, skip);
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'Мої збори коштів' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  async getMyCampaigns(
    @CurrentUser() user: { id: number },
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
  ) {
    return this.service.getMyCampaigns(user.id, limit, skip);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Статистика організації' })
  async getMyStats(@CurrentUser() user: { id: number }) {
    return this.service.getMyStats(user.id);
  }
}
