import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { project_status_enum } from '@prisma/client';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async getProjects(
    @Query('limit') limitStr?: string,
    @Query('skip') skipStr?: string,
    @Query('status') status?: string,
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
      const normalizedStatusInput = status.trim().toUpperCase();

      if (
        !Object.values(project_status_enum).includes(
          normalizedStatusInput as project_status_enum,
        )
      ) {
        throw new BadRequestException('Invalid status value');
      }

      normalizedStatus = normalizedStatusInput as project_status_enum;
    }

    return await this.projectService.getProjects(
      normalizedLimit,
      normalizedSkip,
      normalizedStatus,
    );
  }
}
