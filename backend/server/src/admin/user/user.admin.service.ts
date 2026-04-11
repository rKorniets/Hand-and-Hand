import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserQueryDto } from './dto/user-query.dto';
import { CreateUserAdminDto } from './dto/create-user.admin.dto';
import { UpdateAppUserDto } from '../../app_user/dto/update-app-user.dto';
import { Prisma, user_status_enum, user_role_enum, warning_status_enum } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class UserAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: UserQueryDto) {
    const where: Prisma.app_userWhereInput = {
      ...(query.role && { role: query.role }),
      ...(query.status && { status: query.status }),
      ...(query.search && {
        OR: [
          { email: { contains: query.search, mode: 'insensitive' } },
          { first_name: { contains: query.search, mode: 'insensitive' } },
          { last_name: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.app_user.findMany({
        where,
        take: query.limit,
        skip: query.skip,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          city: true,
          role: true,
          status: true,
          points: true,
          created_at: true,
        },
      }),
      this.prisma.app_user.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const user = await this.prisma.app_user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        city: true,
        role: true,
        status: true,
        points: true,
        created_at: true,
        volunteer_profile: true,
        organization_profile: true,
        admin_profile: true,
        warnings_warnings_user_idToapp_user: {
          where: { status: warning_status_enum.ACTIVE },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateStatus(id: number, status: user_status_enum) {
    await this.findOne(id);

    return this.prisma.app_user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });
  }

  async create(data: CreateUserAdminDto) {
    const hashedPassword = await argon2.hash(data.password);

    return this.prisma.app_user.create({
      data: {
        email: data.email,
        password_hash: hashedPassword,
        role: data.role,
        status: user_status_enum.ACTIVE,
        first_name: data.first_name,
        last_name: data.last_name,
        city: data.city,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
      },
    });
  }

  async update(id: number, data: UpdateAppUserDto) {
    await this.findOne(id);

    return this.prisma.app_user.update({
      where: { id },
      data: {
        ...(data.email !== undefined && { email: data.email }),
        ...(data.first_name !== undefined && { first_name: data.first_name }),
        ...(data.last_name !== undefined && { last_name: data.last_name }),
        ...(data.city !== undefined && { city: data.city }),
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        city: true,
        role: true,
        status: true,
      },
    });
  }

  async updateRole(id: number, role: user_role_enum) {
    await this.findOne(id);

    return this.prisma.app_user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.app_user.delete({ where: { id } });
  }
}
