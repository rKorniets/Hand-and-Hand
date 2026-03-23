import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { project_status_enum } from '@prisma/client';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
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
}
