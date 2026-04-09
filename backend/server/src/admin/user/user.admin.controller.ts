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
import { user_role_enum } from '@prisma/client';

@ApiTags('Адмін — Користувачі')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/users')
export class UserAdminController {
  constructor(private readonly service: UserAdminService) {}

  @Get()
  @ApiOperation({ summary: 'Список користувачів' })
  async findAll(@Query() query: UserQueryDto) {
    return this.service.findAll(query);
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

  //TODO: додати ownership валідацію — адмін може оновлювати будь-кого, звичайний юзер тільки себе
  @Patch(':id')
  @ApiOperation({ summary: 'Оновити дані користувача' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAppUserDto,
  ) {
    return this.service.update(id, data);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Змінити статус користувача (ACTIVE/BLOCKED/INACTIVE)' })
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
