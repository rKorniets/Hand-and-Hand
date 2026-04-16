import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAppUserDto } from './dto/update-app-user.dto';

const USER_SELECT = {
  id: true,
  email: true,
  first_name: true,
  last_name: true,
  city: true,
  role: true,
  status: true,
  created_at: true,
  admin_profile: {
    select: {
      id: true,
      full_name: true,
      is_super_admin: true,
      created_at: true,
    },
  },
} as const;

export interface RequestUser {
  id: number;
}

@Injectable()
export class AppUserService {
  constructor(private prisma: PrismaService) {}

  private async validateUserOwnership(id: number, currentUser: RequestUser) {
    const user = await this.prisma.app_user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    if (id !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have permission to manage another account',
      );
    }
    return user;
  }

  async getUserById(id: number, currentUser: RequestUser) {
    await this.validateUserOwnership(id, currentUser);
    return this.prisma.app_user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
  }

  async updateUserFull(
    id: number,
    data: UpdateAppUserDto,
    currentUser: RequestUser,
  ) {
    await this.validateUserOwnership(id, currentUser);
    return this.prisma.app_user.update({
      where: { id },
      data: {
        ...(data.email && { email: data.email }),
        ...(data.first_name && { first_name: data.first_name }),
        ...(data.last_name && { last_name: data.last_name }),
        ...(data.city && { city: data.city }),
      },
      select: USER_SELECT,
    });
  }

  async deleteUser(id: number, currentUser: RequestUser) {
    await this.validateUserOwnership(id, currentUser);
    return this.prisma.app_user.delete({
      where: { id },
      select: USER_SELECT,
    });
  }
}
