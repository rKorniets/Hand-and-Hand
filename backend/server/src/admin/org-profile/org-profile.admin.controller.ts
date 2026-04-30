import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  Header,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { OrgProfileAdminService } from './org-profile.admin.service';
import { CreateOrgProfileAdminDto } from './dto/create-org-profile.admin.dto';
import { CreateOrganizationProfileDto } from '../../organization_profile/dto/create-organization-profile.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { user_role_enum, organization_profile } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../../common/dto/pagination.dto';
import type { AuthAdmin } from '../approval/approval.admin.controller';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Адмін — Профілі організацій')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/organization-profiles')
export class OrgProfileAdminController extends AbstractCrudController<
  organization_profile[]
> {
  constructor(private readonly service: OrgProfileAdminService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll(limit, skip, search),
    } as unknown as IBaseCrudService<organization_profile[]>);
  }

  @Get()
  @ApiOperation({ summary: 'Список всіх профілів організацій' })
  async getOrgProfiles(@Query() query: PaginationDto) {
    return this.service.findAll(
      query.limit ?? 10,
      query.skip ?? 0,
      query.search,
    );
  }

  @Get('pending')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  @ApiOperation({ summary: 'Список організацій що очікують підтвердження' })
  async findPending() {
    return this.service.findPending();
  }

  @Patch('approvals/:id/approve')
  @ApiOperation({ summary: 'Прийняти організацію' })
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthAdmin,
  ) {
    return this.service.approveOrganization(id, user.id);
  }

  @Patch('approvals/:id/reject')
  @ApiOperation({ summary: 'Відхилити організацію' })
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthAdmin,
  ) {
    return this.service.rejectOrganization(id, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі профілю організації' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити профіль організації (від імені юзера)' })
  async create(@Body() data: CreateOrgProfileAdminDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити профіль організації' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateOrganizationProfileDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити профіль організації' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
  @Patch(':id/logo')
  @ApiOperation({ summary: 'Завантажити/замінити логотип організації' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.updateLogo(id, file);
  }
}
