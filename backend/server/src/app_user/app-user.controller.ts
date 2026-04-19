import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { user_role_enum } from '@prisma/client';
import { AppUserService } from './app-user.service';
import { UpdateAppUserDto } from './dto/update-app-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export interface AuthUser {
  id: number;
  role: user_role_enum;
}

@ApiTags('App Users')
@Controller('app-users')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати профіль поточного користувача' })
  async getMe(@CurrentUser() currentUser: AuthUser) {
    return this.appUserService.getUserById(currentUser.id, currentUser);
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Отримати користувача за ID' })
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.appUserService.getUserById(id, currentUser);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Оновити дані користувача' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAppUserDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.appUserService.updateUserFull(id, data, currentUser);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Видалити користувача' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.appUserService.deleteUser(id, currentUser);
  }
}
