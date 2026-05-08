import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { user_role_enum } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppUserService } from './app-user.service';
import { UpdateAppUserDto } from './dto/update-app-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

export interface AuthUser {
  id: number;
  role: user_role_enum;
}

@ApiTags('App Users')
@Controller('app-users')
@SkipThrottle()
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати профіль поточного користувача' })
  async getMe(@CurrentUser() currentUser: AuthUser) {
    return this.appUserService.getUserById(currentUser.id, currentUser);
  }

  @Patch('me')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Оновити свій профіль (включно з аватаром)' })
  async updateMe(
    @Body() data: UpdateAppUserDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.appUserService.updateUserFull(
      currentUser.id,
      data,
      currentUser,
    );
  }

  @Post('me/avatar')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Завантажити/замінити аватар' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.appUserService.uploadAvatar(file, currentUser);
  }

  @Delete('me/avatar')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Видалити аватар поточного користувача' })
  async deleteMyAvatar(@CurrentUser() currentUser: AuthUser) {
    return this.appUserService.deleteAvatar(currentUser.id, currentUser);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати користувача за ID' })
  getUserById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.appUserService.getUserById(id, currentUser);
  }

  @Put(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
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
  @Throttle({ default: { limit: 10, ttl: 60000 } })
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
