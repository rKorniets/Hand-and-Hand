import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAppUserDto } from './dto/update-app-user.dto';
import type { AuthUser } from './app-user.controller';
import { CloudinaryService, ImageType } from '../cloudinary/cloudinary.service';

const USER_SELECT = {
  id: true,
  email: true,
  first_name: true,
  last_name: true,
  city: true,
  role: true,
  status: true,
  points: true,
  created_at: true,
  avatar_url: true,
  admin_profile: {
    select: {
      id: true,
      full_name: true,
      is_super_admin: true,
      created_at: true,
    },
  },
} as const;

@Injectable()
export class AppUserService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  private async validateUserOwnership(id: number, currentUser: AuthUser) {
    const user = await this.prisma.app_user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    if (id !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have permission to manage another account',
      );
    }
    return user;
  }

  async getUserById(id: number, currentUser: AuthUser) {
    await this.validateUserOwnership(id, currentUser);
    return this.prisma.app_user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
  }

  async updateUserFull(
    id: number,
    data: UpdateAppUserDto,
    currentUser: AuthUser,
  ) {
    await this.validateUserOwnership(id, currentUser);
    return this.prisma.app_user.update({
      where: { id },
      data: {
        ...(data.email !== undefined && { email: data.email }),
        ...(data.first_name !== undefined && { first_name: data.first_name }),
        ...(data.last_name !== undefined && { last_name: data.last_name }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.avatar_url !== undefined && { avatar_url: data.avatar_url }),
      },
      select: USER_SELECT,
    });
  }

  async uploadAvatar(file: Express.Multer.File, currentUser: AuthUser) {
    const user = await this.prisma.app_user.findUnique({
      where: { id: currentUser.id },
      select: { avatar_url: true },
    });

    const avatar_url = await this.cloudinaryService.replaceImage(
      file,
      ImageType.AVATAR,
      user?.avatar_url,
      currentUser.id,
    );

    return this.prisma.app_user.update({
      where: { id: currentUser.id },
      data: { avatar_url },
      select: USER_SELECT,
    });
  }

  async deleteAvatar(id: number, currentUser: AuthUser) {
    await this.validateUserOwnership(id, currentUser);

    const user = await this.prisma.app_user.findUnique({
      where: { id },
      select: { avatar_url: true },
    });

    if (user?.avatar_url) {
      await this.cloudinaryService.deleteImage(user.avatar_url);
    }

    return this.prisma.app_user.update({
      where: { id },
      data: { avatar_url: null },
      select: USER_SELECT,
    });
  }

  async deleteUser(id: number, currentUser: AuthUser) {
    await this.validateUserOwnership(id, currentUser);
    return this.prisma.app_user.delete({
      where: { id },
      select: USER_SELECT,
    });
  }
}
