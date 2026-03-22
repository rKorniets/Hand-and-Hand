import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { project_status_enum } from '@prisma/client';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('Проєкти (Projects)')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список проєктів' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Кількість проєктів на сторінці (за замовчуванням 5)',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Скільки проєктів пропустити з початку',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Фільтр за статусом (DRAFT, ACTIVE, COMPLETED, ARCHIVED)',
  })
  async getProjects(
    @Query('limit') limitStr?: string,
    @Query('skip') skipStr?: string,
    @Query('status') statusStr?: string,
  ) {
    const DEFAULT_LIMIT = 5;
    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;
    const DEFAULT_SKIP = 0;

    let limit = limitStr ? parseInt(limitStr, 10) : DEFAULT_LIMIT;
    if (isNaN(limit) || limit < MIN_LIMIT) limit = DEFAULT_LIMIT;
    limit = Math.min(limit, MAX_LIMIT);

    let skip = skipStr ? parseInt(skipStr, 10) : DEFAULT_SKIP;
    if (isNaN(skip) || skip < 0) skip = DEFAULT_SKIP;

    let status: project_status_enum | undefined = undefined;

    if (statusStr !== undefined) {
      if (!Object.values(project_status_enum).includes(statusStr as project_status_enum)) {
        throw new BadRequestException('Invalid status value');
      }
      status = statusStr as project_status_enum;
    }

    return this.projectService.getProjects(limit, skip, status);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Повністю оновити проєкт' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateProjectDto,
  ) {
    return this.projectService.updateProjectFull(id, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Частково оновити проєкт' })
  async updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProjectDto,
  ) {
    return this.projectService.updateProjectPartial(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити проєкт' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.deleteProject(id);
  }
}
