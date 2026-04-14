import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, user_role_enum, user_status_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAppUserDto } from './dto/update-app-user.dto';

const USER_SELECT = {
  id: true,
  email: true,
  role: true,
  status: true,
  points: true,
  created_at: true,
} as const;

export interface RequestUser {
  id: number;
}

@Injectable()
export class AppUserService {
  constructor(private prisma: PrismaService) {}

  private async validateUserOwnership(id: number, currentUser: RequestUser) {
    const user = await this.prisma.app_user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (id !== currentUser.id) {
      throw new ForbiddenException(
        'You do not have permission to manage another user\'s account',
      );
    }

    return user;
  }

  async getUsers(
    limit: number,
    skip: number,
    role?: user_role_enum,
    status?: user_status_enum,
  ) {
    const whereClause: Prisma.app_userWhereInput = {};
    if (role !== undefined) whereClause.role = role;
    if (status !== undefined) whereClause.status = status;

    return this.prisma.app_user.findMany({
      where: whereClause,
      take: limit,
      skip: skip,
      orderBy: { created_at: 'desc' },
      select: USER_SELECT,
    });
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
        ...(data.email !== undefined && { email: data.email }),
        ...(data.first_name !== undefined && { first_name: data.first_name }),
        ...(data.last_name !== undefined && { last_name: data.last_name }),
        ...(data.city !== undefined && { city: data.city }),
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
