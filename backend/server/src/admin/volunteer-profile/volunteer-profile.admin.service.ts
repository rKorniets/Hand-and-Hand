import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVolunteerProfileAdminDto } from './dto/create-volunteer-profile.admin.dto';
import { CreateVolunteerProfileDto } from '../../volunteer_profile/dto/create-volunteer-profile.dto';
import { UpdateVolunteerProfileDto } from '../../volunteer_profile/dto/update-volunteer-profile.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class VolunteerProfileAdminService {
  constructor(private readonly prisma: PrismaService) {}

  // noinspection DuplicatedCode
  async create(data: CreateVolunteerProfileAdminDto) {
    return this.prisma.volunteer_profile.create({
      data: {
        user_id: data.user_id,
        display_name: data.display_name,
        phone: data.phone,
        bio: data.bio,
        skills_text: data.skills_text,
        is_verified: false,
      },
    });
  }

  async findAll(limit?: number, skip?: number, search?: string) {
    const whereClause: Prisma.volunteer_profileWhereInput = search
      ? {
          OR: [
            { display_name: { contains: search, mode: 'insensitive' } },
            { skills_text: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.volunteer_profile.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.volunteer_profile.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const profile = await this.prisma.volunteer_profile.findUnique({
      where: { id },
      include: {
        app_user: {
          select: { id: true, email: true, role: true, status: true },
        },
        task_assignment: true,
        tickets: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(`Volunteer profile with ID ${id} not found`);
    }

    return profile;
  }

  // noinspection DuplicatedCode
  async update(id: number, data: CreateVolunteerProfileDto) {
    await this.findOne(id);

    return this.prisma.volunteer_profile.update({
      where: { id },
      data: {
        display_name: data.display_name,
        phone: data.phone,
        bio: data.bio,
        skills_text: data.skills_text,
      },
    });
  }

  // noinspection DuplicatedCode
  async updatePartial(id: number, data: UpdateVolunteerProfileDto) {
    await this.findOne(id);
    // noinspection DuplicatedCode
    return this.prisma.volunteer_profile.update({
      where: { id },
      data: {
        ...(data.display_name !== undefined && {
          display_name: data.display_name,
        }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.skills_text !== undefined && {
          skills_text: data.skills_text,
        }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.volunteer_profile.delete({ where: { id } });
  }
}
