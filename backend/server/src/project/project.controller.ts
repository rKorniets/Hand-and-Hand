import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { project_status_enum, user_role_enum } from '@prisma/client';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати список подій' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getProjects(
    @Query('limit') limitStr?: string,
    @Query('skip') skipStr?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const DEFAULT_LIMIT = 5;
    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;
    const DEFAULT_SKIP = 0;

    const parsedLimit = limitStr ? parseInt(limitStr, 10) : DEFAULT_LIMIT;
    const normalizedLimit = Number.isNaN(parsedLimit)
      ? DEFAULT_LIMIT
      : Math.min(Math.max(parsedLimit, MIN_LIMIT), MAX_LIMIT);

    const parsedSkip = skipStr ? parseInt(skipStr, 10) : DEFAULT_SKIP;
    const normalizedSkip = Number.isNaN(parsedSkip)
      ? DEFAULT_SKIP
      : Math.max(parsedSkip, DEFAULT_SKIP);

    let normalizedStatus: project_status_enum | undefined;
    if (status !== undefined) {
      if (!(status in project_status_enum)) {
        throw new BadRequestException('Invalid status value');
      }
      normalizedStatus =
        project_status_enum[status as keyof typeof project_status_enum];
    }

    return await this.projectService.getProjects(
      normalizedLimit,
      normalizedSkip,
      normalizedStatus,
      search,
    );
  }

  @Post()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Створити подію' })
  async create(@Body() data: CreateProjectDto) {
    return this.projectService.createProject(data);
  }

  @Put(':id')
  @Roles(user_role_enum.ORGANIZATION) //TODO ownership
  @ApiOperation({ summary: 'Оновити подію' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateProjectDto,
  ) {
    return this.projectService.updateProject(id, data);
  }

  @Delete(':id')
  @Roles(user_role_enum.ORGANIZATION) //TODO ownership
  @ApiOperation({ summary: 'Видалити подію' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.deleteProject(id);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати подію за ID' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.getProjectById(id);
  }

  @Post(':id/register')
  @ApiOperation({ summary: 'Записатися на подію' })
  async register(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.projectService.registerForProject(id, user.id);
  }

  @Delete(':id/register')
  @ApiOperation({ summary: 'Скасувати реєстрацію на подію' })
  async unregister(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.projectService.unregisterFromProject(id, user.id);
  }

  @Get(':id/registrations')
  @Public()
  @ApiOperation({ summary: 'Список зареєстрованих людей на подію' })
  async getRegistrations(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.getProjectRegistrations(id);
  }
}
