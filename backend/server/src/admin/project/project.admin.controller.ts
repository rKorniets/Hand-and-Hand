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
import { ProjectAdminService } from './project.admin.service';
import { ProjectQueryAdminDto } from './dto/project-query.admin.dto';
import { CreateProjectDto } from '../../project/dto/create-project.dto';
import { UpdateProjectDto } from '../../project/dto/update-project.dto';
import { UpdateProjectStatusAdminDto } from './dto/update-project-status.admin.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum, project } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Адмін — Проєкти')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/projects')
export class ProjectAdminController extends AbstractCrudController<project[]> {
  constructor(private readonly service: ProjectAdminService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll({ limit, skip, search } as ProjectQueryAdminDto),
    } as unknown as IBaseCrudService<project[]>);
  }

  @Get()
  @ApiOperation({ summary: 'Список усіх проєктів' })
  async getProjects(
    @Query() paginationQuery: PaginationDto,
    @Query() projectQuery: ProjectQueryAdminDto,
  ) {
    return this.service.findAll({
      ...projectQuery,
      limit: paginationQuery.limit ?? 10,
      skip: paginationQuery.skip ?? 0,
      search: paginationQuery.search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі проєкту' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити проєкт' })
  async create(@Body() data: CreateProjectDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити проєкт' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProjectDto,
  ) {
    return this.service.update(id, data);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Змінити статус проєкту' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectStatusAdminDto,
  ) {
    return this.service.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити проєкт' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
