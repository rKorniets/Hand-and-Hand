import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVolunteerProfileDto } from './dto/create-volunteer-profile.dto';
import { UpdateVolunteerProfileDto } from './dto/update-volunteer-profile.dto';

export interface RequestUser {
  id: number;
}

@Injectable()
export class VolunteerProfileService {
  constructor(private prisma: PrismaService) {}

  private async validateProfileOwnership(id: number, currentUser: RequestUser) {
    const profile = await this.prisma.volunteer_profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(`Volunteer profile with ID ${id} not found`);
    }

    if (profile.user_id !== currentUser.id) {
      throw new ForbiddenException(
        "You do not have permission to edit or delete another user's profile",
      );
    }

    return profile;
  }

  async getVolunteerProfiles(
    limit?: number,
    skip?: number,
    isVerified?: boolean,
    search?: string,
  ) {
    const whereClause: Prisma.volunteer_profileWhereInput = {
      ...(isVerified !== undefined && { is_verified: isVerified }),
      ...(search && {
        display_name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

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

  async getVolunteerProfileById(id: number) {
    return this.prisma.volunteer_profile.findUnique({ where: { id } });
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
        display_name: data.display_name,
        phone: data.phone,
        bio: data.bio,
        skills_text: data.skills_text,
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
      },
    });
  }

  async deleteVolunteerProfile(id: number, currentUser: RequestUser) {
    await this.validateProfileOwnership(id, currentUser);

    return this.prisma.volunteer_profile.delete({ where: { id } });
  }
}
