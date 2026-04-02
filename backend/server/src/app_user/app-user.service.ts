import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, user_role_enum, user_status_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppUserDto } from './dto/create-app-user.dto';
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
  role: user_role_enum;
}

@Injectable()
export class AppUserService {
  constructor(private prisma: PrismaService) {}

  private async validateUserOwnership(id: number, currentUser: RequestUser) {
    const user = await this.prisma.app_user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Користувача з ID ${id} не знайдено`);
    }

    if (currentUser.role !== user_role_enum.ADMIN && id !== currentUser.id) {
      throw new ForbiddenException(
        'Ви не маєте прав на керування чужим акаунтом',
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

  async createUser(data: CreateAppUserDto) {
    return this.prisma.app_user.create({
      data: {
        email: data.email,
        password_hash: data.password_hash,
        role: data.role,
        status: data.status ?? user_status_enum.PENDING,
        points: data.points ?? 0,
      },
      select: USER_SELECT,
    });
  }

  async updateUserFull(
    id: number,
    data: UpdateAppUserDto,
    currentUser: RequestUser,
  ) {
    const user = await this.validateUserOwnership(id, currentUser);

    const updatedRole =
      currentUser.role === user_role_enum.ADMIN && data.role
        ? data.role
        : user.role;
    const updatedStatus =
      currentUser.role === user_role_enum.ADMIN && data.status
        ? data.status
        : user.status;
    const updatedPoints =
      currentUser.role === user_role_enum.ADMIN && data.points !== undefined
        ? data.points
        : user.points;

    return this.prisma.app_user.update({
      where: { id },
      data: {
        email: data.email,
        password_hash: data.password_hash,
        role: updatedRole,
        status: updatedStatus,
        points: updatedPoints,
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
