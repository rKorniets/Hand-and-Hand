import {
  Controller,
  Get,
  Query,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  ParseEnumPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  project_registration_status_enum,
  project_status_enum,
  user_role_enum,
  project,
} from '@prisma/client';
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
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
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
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
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
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Список зареєстрованих людей на подію' })
  async getRegistrations(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.getProjectRegistrations(id);
  }

  @Get(':id/my-registration')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Перевірити мою реєстрацію на подію' })
  async getMyRegistration(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectService.getMyRegistration(id, user.id);
  }

  @Get(':id/registrations/manage')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({
    summary: 'Список заявок на участь у проекті (для власника)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: project_registration_status_enum,
  })
  async listRegistrationsForOwner(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Query(
      'status',
      new ParseEnumPipe(project_registration_status_enum, { optional: true }),
    )
    status?: project_registration_status_enum,
  ) {
    return this.projectService.listProjectRegistrationsForOwner(
      id,
      user,
      status,
    );
  }

  @Patch(':id/registrations/:registrationId/accept')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Прийняти заявку на участь у проекті' })
  async acceptRegistration(
    @Param('id', ParseIntPipe) id: number,
    @Param('registrationId', ParseIntPipe) registrationId: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectService.acceptProjectRegistration(
      id,
      registrationId,
      user,
    );
  }

  @Patch(':id/registrations/:registrationId/reject')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Відхилити заявку на участь у проекті' })
  async rejectRegistration(
    @Param('id', ParseIntPipe) id: number,
    @Param('registrationId', ParseIntPipe) registrationId: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectService.rejectProjectRegistration(
      id,
      registrationId,
      user,
    );
  }

  @Patch(':id/image')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Завантажити/замінити зображення проєкту' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { id: number },
  ) {
    return this.projectService.updateImage(id, file, { id: user.id });
  }
}
