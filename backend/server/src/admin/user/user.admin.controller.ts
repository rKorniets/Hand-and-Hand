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
  UseGuards,
} from '@nestjs/common';
import { UserAdminService } from './user.admin.service';
import { UserQueryDto } from './dto/user-query.dto';
import { CreateUserAdminDto } from './dto/create-user.admin.dto';
import { UpdateAppUserDto } from '../../app_user/dto/update-app-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { SuperAdminGuard } from '../guards/super-admin.guard';
import { user_role_enum, app_user } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Адмін — Користувачі')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/users')
export class UserAdminController extends AbstractCrudController<app_user[]> {
  constructor(private readonly service: UserAdminService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll({ limit, skip, search } as UserQueryDto),
    } as unknown as IBaseCrudService<app_user[]>);
  }

  @Get()
  @ApiOperation({ summary: 'Список користувачів' })
  async getUsers(
    @Query() paginationQuery: PaginationDto,
    @Query() userQuery: UserQueryDto,
  ) {
    return this.service.findAll({
      ...userQuery,
      limit: paginationQuery.limit ?? 10,
      skip: paginationQuery.skip ?? 0,
      search: paginationQuery.search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Повна інформація про користувача' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити користувача' })
  async create(@Body() data: CreateUserAdminDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити дані користувача' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAppUserDto,
  ) {
    return this.service.update(id, data);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Змінити статус користувача (ACTIVE/BLOCKED/INACTIVE)',
  })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.service.updateStatus(id, dto.status);
  }

  @Patch(':id/role')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Змінити роль користувача (тільки супер-адмін)' })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.service.updateRole(id, dto.role);
  }

  @Delete(':id')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Видалити користувача (тільки супер-адмін)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
