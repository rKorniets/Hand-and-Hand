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
    @Query('status') statusStr?: string,
  ) {
    let limit = limitStr ? parseInt(limitStr, 10) : 5;
    if (isNaN(limit) || limit < 1) {
      limit = 5;
    }
    limit = Math.min(limit, 50);

    let skip = skipStr ? parseInt(skipStr, 10) : 0;
    if (isNaN(skip) || skip < 0) {
      skip = 0;
    }

    let status: project_status_enum | undefined = undefined;

    if (statusStr !== undefined) {
      const isValidStatus = Object.values(project_status_enum).includes(
        statusStr as project_status_enum,
      );

      if (!isValidStatus) {
        throw new BadRequestException('Invalid status value');
      }

      status = statusStr as project_status_enum;
    }

    return this.projectService.getProjects(limit, skip, status);
  }
}
