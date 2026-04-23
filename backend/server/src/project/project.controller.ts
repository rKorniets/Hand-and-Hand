import {
  Controller,
  Get,
  Query,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { project_status_enum, user_role_enum, project } from '@prisma/client';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  AbstractCrudController,
  IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController extends AbstractCrudController<project[]> {
  constructor(private readonly projectService: ProjectService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        projectService.getProjects(limit, skip, undefined, search),
    } as unknown as IBaseCrudService<project[]>);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати список подій' })
  @ApiQuery({ name: 'status', required: false, enum: project_status_enum })
  @ApiQuery({ name: 'organization_profile_id', required: false, type: Number })
  async getProjects(
    @Query() query: PaginationDto,
    @Query('status', new ParseEnumPipe(project_status_enum, { optional: true }))
    status?: project_status_enum,
  ) {
    return await this.projectService.getProjects(
      query.limit ?? 5,
      query.skip ?? 0,
      status,
      query.search,
      query.organization_profile_id,
    );
  }

  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Створити подію' })
  async create(
    @Body() data: CreateProjectDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectService.createProject(data, { id: user.id });
    return this.projectService.createProject(data, user.id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Оновити подію' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateProjectDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectService.updateProject(id, data, { id: user.id });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Видалити подію' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectService.deleteProject(id, { id: user.id });
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати подію за ID' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.getProjectById(id);
  }

  @Post(':id/register')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Записатися на подію' })
  async register(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectService.registerForProject(id, user.id);
  }

  @Delete(':id/register')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Скасувати реєстрацію на подію' })
  async unregister(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
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
