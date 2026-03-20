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
import { project_status_enum } from '@prisma/client';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список подій' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getProjects(
    @Query('limit') limitStr?: string,
    @Query('status') status?: string,
  ) {
    const DEFAULT_LIMIT = 5;
    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;

    const parsedLimit = limitStr ? parseInt(limitStr, 10) : DEFAULT_LIMIT;
    const normalizedLimit = Number.isNaN(parsedLimit)
      ? DEFAULT_LIMIT
      : Math.min(Math.max(parsedLimit, MIN_LIMIT), MAX_LIMIT);

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
      normalizedStatus,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Створити подію' })
  async create(@Body() data: CreateProjectDto) {
    return this.projectService.createProject(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити подію' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateProjectDto,
  ) {
    return this.projectService.updateProject(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити подію' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.deleteProject(id);
  }
}
