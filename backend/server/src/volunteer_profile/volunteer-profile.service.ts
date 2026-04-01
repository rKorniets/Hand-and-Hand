import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, user_role_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVolunteerProfileDto } from './dto/create-volunteer-profile.dto';
import { UpdateVolunteerProfileDto } from './dto/update-volunteer-profile.dto';

export interface RequestUser {
  id: number;
  role: user_role_enum;
}

@Injectable()
export class VolunteerProfileService {
  constructor(private prisma: PrismaService) {}

  private async validateProfileOwnership(id: number, currentUser: RequestUser) {
    const profile = await this.prisma.volunteer_profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(`Профіль волонтера з ID ${id} не знайдено`);
    }

    if (
      currentUser.role !== user_role_enum.ADMIN &&
      profile.user_id !== currentUser.id
    ) {
      throw new ForbiddenException(
        'Ви не маєте прав редагувати або видаляти чужий профіль',
      );
    }

    return profile;
  }

  async getVolunteerProfiles(
    limit: number,
    skip: number,
    isVerified?: boolean,
  ) {
    const whereClause: Prisma.volunteer_profileWhereInput = {};
    if (isVerified !== undefined) whereClause.is_verified = isVerified;

    return this.prisma.volunteer_profile.findMany({
      where: whereClause,
      take: limit,
      skip: skip,
      orderBy: { created_at: 'desc' },
    });
  }

  async getVolunteerProfileById(id: number) {
    return this.prisma.volunteer_profile.findUnique({ where: { id } });
  }

  async createVolunteerProfile(data: CreateVolunteerProfileDto) {
    return this.prisma.volunteer_profile.create({
      data: {
        user_id: data.user_id,
        display_name: data.display_name,
        phone: data.phone,
        bio: data.bio,
        skills_text: data.skills_text,
        rating: data.rating,
        is_verified: data.is_verified ?? false,
      },
    });
  }

  async updateVolunteerProfileFull(
    id: number,
    data: CreateVolunteerProfileDto,
    currentUser: RequestUser,
  ) {
    await this.validateProfileOwnership(id, currentUser);

    return this.prisma.volunteer_profile.update({
      where: { id },
      data: {
        user_id: data.user_id,
        display_name: data.display_name,
        phone: data.phone,
        bio: data.bio,
        skills_text: data.skills_text,
        rating: data.rating,
        is_verified: data.is_verified ?? false,
      },
    });
  }

  async updateVolunteerProfilePartial(
    id: number,
    data: UpdateVolunteerProfileDto,
    currentUser: RequestUser,
  ) {
    await this.validateProfileOwnership(id, currentUser);

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
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.is_verified !== undefined && {
          is_verified: data.is_verified,
        }),
      },
    });
  }

  async deleteVolunteerProfile(id: number, currentUser: RequestUser) {
    await this.validateProfileOwnership(id, currentUser);

    return this.prisma.volunteer_profile.delete({ where: { id } });
  }
}
