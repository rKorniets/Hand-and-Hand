import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { user_role_enum, user_status_enum } from '@prisma/client';
import { AppUserService } from './app-user.service';
import { CreateAppUserDto } from './dto/create-app-user.dto';

@ApiTags('Користувачі (App Users)')
@Controller('app-users')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Get()
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
    description: 'Фільтр за роллю (VOLUNTEER, ORGANIZATION, RECIPIENT, ADMIN)',
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
    let limit = limitStr ? parseInt(limitStr, 10) : 5;
    if (isNaN(limit) || limit < 1) limit = 5;
    limit = Math.min(limit, 50);

    let skip = skipStr ? parseInt(skipStr, 10) : 0;
    if (isNaN(skip) || skip < 0) skip = 0;

    const role = Object.values(user_role_enum).includes(
      roleStr as user_role_enum,
    )
      ? (roleStr as user_role_enum)
      : undefined;

    const status = Object.values(user_status_enum).includes(
      statusStr as user_status_enum,
    )
      ? (statusStr as user_status_enum)
      : undefined;

    return this.appUserService.getUsers(limit, skip, role, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати користувача за ID' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.appUserService.getUserById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити нового користувача' })
  async create(@Body() data: CreateAppUserDto) {
    return this.appUserService.createUser(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити дані користувача' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateAppUserDto,
  ) {
    return this.appUserService.updateUserFull(id, data);
  }
}
