import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrgProfileAdminService } from './org-profile.admin.service';
import { CreateOrgProfileAdminDto } from './dto/create-org-profile.admin.dto';
import { CreateOrganizationProfileDto } from '../../organization_profile/dto/create-organization-profile.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Адмін — Профілі організацій')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/organization-profiles')
export class OrgProfileAdminController {
  constructor(private readonly service: OrgProfileAdminService) {}

  @Get()
  @ApiOperation({ summary: 'Список всіх профілів організацій' })
  async findAll() {
    return this.service.findAll();
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
}
