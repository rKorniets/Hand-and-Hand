import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { user_role_enum } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { createHmac } from 'crypto';
import { AppUserService } from './app-user.service';
import { UpdateAppUserDto } from './dto/update-app-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

export interface AuthUser {
  id: number;
  role: user_role_enum;
}

export class CloudinaryContextCustomDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  user_id?: string;
}

export class CloudinaryContextDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CloudinaryContextCustomDto)
  custom?: CloudinaryContextCustomDto;
}

export class CloudinaryWebhookDto {
  @ApiProperty()
  @IsString()
  notification_type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  moderation_status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CloudinaryContextDto)
  context?: CloudinaryContextDto;
}

function verifyCloudinarySignature(req: RawBodyRequest<Request>): boolean {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) return false;

  const signature = req.headers['x-cld-signature'] as string;
  const timestamp = req.headers['x-cld-timestamp'] as string;
  if (!signature || !timestamp) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > 3600) return false;

  const rawBody = req.rawBody;
  if (!rawBody) return false;

  const expected = createHmac('sha256', apiSecret)
    .update(rawBody.toString() + timestamp)
    .digest('hex');

  return expected === signature;
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

  @Patch('me')
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Видалити аватар поточного користувача' })
  async deleteMyAvatar(@CurrentUser() currentUser: AuthUser) {
    return this.appUserService.deleteAvatar(currentUser.id, currentUser);
  }

  @Post('webhook/avatar-moderated')
  @Public()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Webhook від Cloudinary — фото відхилено модерацією',
  })
  async avatarModeratedWebhook(
    @Body() body: CloudinaryWebhookDto,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!verifyCloudinarySignature(req)) {
      return { ok: false, reason: 'invalid_signature' };
    }

    if (
      body.notification_type === 'moderation' &&
      body.moderation_status === 'rejected'
    ) {
      const userId = body.context?.custom?.user_id;
      if (userId) {
        await this.appUserService.handleAvatarModerated(Number(userId));
      }
    }

    return { ok: true };
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
