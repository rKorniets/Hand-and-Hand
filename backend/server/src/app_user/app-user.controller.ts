import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { user_role_enum, user_status_enum } from '@prisma/client';
import { AppUserService } from './app-user.service';
import { CreateAppUserDto } from './dto/create-app-user.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Користувачі (App Users)')
@Controller('app-users')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Get()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Отримати список користувачів' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Кількість записів на сторінці (за замовчуванням 5)',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Скільки записів пропустити',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Фільтр за роллю (VOLUNTEER, ORGANIZATION, ADMIN)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Фільтр за статусом (ACTIVE, INACTIVE, BLOCKED, PENDING)',
  })
  async getUsers(
    @Query('limit') limitStr?: string,
    @Query('skip') skipStr?: string,
    @Query('role') roleStr?: string,
    @Query('status') statusStr?: string,
  ) {
    const DEFAULT_LIMIT = 5;
    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;
    const DEFAULT_SKIP = 0;

    let limit = limitStr ? parseInt(limitStr, 10) : DEFAULT_LIMIT;
    if (isNaN(limit) || limit < MIN_LIMIT) limit = DEFAULT_LIMIT;
    limit = Math.min(limit, MAX_LIMIT);

    let skip = skipStr ? parseInt(skipStr, 10) : DEFAULT_SKIP;
    if (isNaN(skip) || skip < 0) skip = DEFAULT_SKIP;

    let role: user_role_enum | undefined;
    if (roleStr !== undefined) {
      if (!Object.values(user_role_enum).includes(roleStr as user_role_enum)) {
        throw new BadRequestException('Invalid role value');
      }
      role = roleStr as user_role_enum;
    }

    let status: user_status_enum | undefined;
    if (statusStr !== undefined) {
      if (
        !Object.values(user_status_enum).includes(statusStr as user_status_enum)
      ) {
        throw new BadRequestException('Invalid status value');
      }
      status = statusStr as user_status_enum;
    }

    return this.appUserService.getUsers(limit, skip, role, status);
  }

  @Public()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Отримати користувача за ID' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.appUserService.getUserById(id);
  }

  @Post()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Створити нового користувача' })
  async create(@Body() data: CreateAppUserDto) {
    return this.appUserService.createUser(data);
  }

  @Put(':id')
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Оновити дані користувача' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateAppUserDto,
  ) {
    return this.appUserService.updateUserFull(id, data);
  }

  @Delete(':id')
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Видалити користувача' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.appUserService.deleteUser(id);
  }
}

//TODO OWNERSHIP
