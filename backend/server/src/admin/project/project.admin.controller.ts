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
import { user_role_enum } from '@prisma/client';

@ApiTags('Admin — Projects')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/projects')
export class ProjectAdminController {
  constructor(private readonly service: ProjectAdminService) {}

  @Get()
  @ApiOperation({ summary: 'List all projects' })
  async findAll(@Query() query: ProjectQueryAdminDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create project' })
  async create(@Body() data: CreateProjectDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProjectDto,
  ) {
    return this.service.update(id, data);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update project status' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectStatusAdminDto,
  ) {
    return this.service.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
