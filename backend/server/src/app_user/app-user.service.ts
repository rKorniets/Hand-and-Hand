import { Injectable } from '@nestjs/common';
import { Prisma, user_role_enum, user_status_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppUserDto } from './dto/create-app-user.dto';

@Injectable()
export class AppUserService {
  constructor(private prisma: PrismaService) {}

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
    });
  }

  async getUserById(id: number) {
    return this.prisma.app_user.findUnique({ where: { id } });
  }

  async createUser(data: CreateAppUserDto) {
    return this.prisma.app_user.create({
      data: {
        email: data.email,
        password_hash: data.password_hash,
        role: data.role,
        status: data.status ?? 'PENDING',
        points: data.points ?? 0,
      },
    });
  }

  async updateUserFull(id: number, data: CreateAppUserDto) {
    return this.prisma.app_user.update({
      where: { id },
      data: {
        email: data.email,
        password_hash: data.password_hash,
        role: data.role,
        status: data.status,
        points: data.points,
      },
    });
  }
}
