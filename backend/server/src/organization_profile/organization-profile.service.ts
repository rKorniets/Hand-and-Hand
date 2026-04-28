import {
  BadRequestException,
  ConflictException,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  organization_membership_request_direction_enum,
  organization_membership_request_status_enum,
  user_role_enum,
  verification_status_enum,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationProfileDto } from './dto/create-organization-profile.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

export interface RequestUser {
  id: number;
}

@Injectable()
export class OrganizationProfileService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  private async validateOrganizationOwnership(
    id: number,
    currentUser: RequestUser,
  ) {
    const profile = await this.prisma.organization_profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(
        `Organization profile with ID ${id} not found`,
      );
    }

    if (profile.user_id !== currentUser.id) {
      throw new ForbiddenException(
        "You do not have permission to edit or delete another user's profile",
      );
    }

    return profile;
  }

  async getOrganizationProfiles(
    limit: number,
    skip: number,
    verificationStatus?: verification_status_enum | verification_status_enum[],
    search?: string,
    categories?: string[],
  ) {
    const whereClause: Prisma.organization_profileWhereInput = {};

    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }

    if (verificationStatus) {
      const statusArray = Array.isArray(verificationStatus)
        ? verificationStatus
        : [verificationStatus];
      whereClause.verification_status = { in: statusArray };
    }

    if (categories && categories.length > 0) {
      whereClause.organization_category = {
        some: {
          category: {
            slug: { in: categories },
          },
        },
      };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.organization_profile.findMany({
        where: whereClause,
        take: limit,
        skip,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.organization_profile.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async getOrganizationProfileById(id: number) {
    return this.prisma.organization_profile.findUnique({ where: { id } });
  }

  async createOrganizationProfile(
    data: CreateOrganizationProfileDto,
    currentUser: RequestUser,
  ) {
    return this.prisma.organization_profile.create({
      data: {
        user_id: currentUser.id,
        name: data.name,
        edrpou: data.edrpou,
        description: data.description,
        verification_status: verification_status_enum.PENDING,
        official_docs_url: data.official_docs_url,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        location_id: data.location_id,
        mission: data.mission,
        logo_url: data.logo_url,
      },
    });
  }

  async updateOrganizationProfileFull(
    id: number,
    data: CreateOrganizationProfileDto,
    currentUser: RequestUser,
  ) {
    await this.validateOrganizationOwnership(id, currentUser);

    return this.prisma.organization_profile.update({
      where: { id },
      data: {
        name: data.name,
        edrpou: data.edrpou,
        description: data.description,
        official_docs_url: data.official_docs_url,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        location_id: data.location_id,
        mission: data.mission,
      },
    });
  }
  async updateLogo(
    id: number,
    file: Express.Multer.File,
    currentUser: RequestUser,
  ): Promise<{ logo_url: string }> {
    const existing = await this.validateOrganizationOwnership(id, currentUser);
    if (existing.logo_url) await this.cloudinary.deleteImage(existing.logo_url);
    const logo_url = await this.cloudinary.uploadOrgLogo(file);
    await this.prisma.organization_profile.update({
      where: { id },
      data: { logo_url },
    });
    return { logo_url };
  }
  async deleteOrganizationProfile(id: number, currentUser: RequestUser) {
    const existing = await this.validateOrganizationOwnership(id, currentUser);
    if (existing.logo_url) await this.cloudinary.deleteImage(existing.logo_url);
    return this.prisma.organization_profile.delete({ where: { id } });
  }

  async getOrganizationProjects(orgId: number) {
    return this.prisma.project.findMany({
      where: { organization_profile_id: orgId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrganizationReports(orgId: number) {
    return this.prisma.report.findMany({
      where: { organization_profile_id: orgId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrganizationMembers(orgId: number) {
    return this.prisma.organization_profile.findUnique({
      where: { id: orgId },
      include: {
        members: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            city: true,
          },
        },
      },
    });
  }

  async getOrganizationFundraising(orgId: number) {
    return this.prisma.fundraising_campaign.findMany({
      where: { organization_profile_id: orgId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrganizationProfileByUserId(userId: number) {
    return this.prisma.organization_profile.findUnique({
      where: { user_id: userId },
    });
  }

  async createMembershipRequest(orgId: number, currentUser: RequestUser) {
    const organization = await this.prisma.organization_profile.findUnique({
      where: { id: orgId },
    });

    if (!organization) {
      throw new NotFoundException(
        `Organization profile with ID ${orgId} not found`,
      );
    }

    if (
      organization.verification_status !== verification_status_enum.VERIFIED
    ) {
      throw new BadRequestException(
        'Cannot join an organization that is not verified',
      );
    }

    if (organization.user_id === currentUser.id) {
      throw new BadRequestException(
        'Organization owner cannot request to join their own organization',
      );
    }

    const user = await this.prisma.app_user.findUnique({
      where: { id: currentUser.id },
      select: { organization_id: true },
    });

    if (user?.organization_id) {
      throw new ConflictException(
        'You already belong to an organization. Leave it before joining another.', // meow <3
      );
    }

    const existing =
      await this.prisma.organization_membership_request.findUnique({
        where: {
          organization_id_user_id: {
            organization_id: orgId,
            user_id: currentUser.id,
          },
        },
      });

    if (existing) {
      if (
        existing.status === organization_membership_request_status_enum.PENDING
      ) {
        if (
          existing.direction ===
          organization_membership_request_direction_enum.INVITE
        ) {
          return this.acceptPendingRecordAsMember(
            existing.id,
            currentUser.id,
            orgId,
          );
        }

        throw new ConflictException(
          'You already have a pending request for this organization',
        );
      }

      return this.prisma.organization_membership_request.update({
        where: { id: existing.id },
        data: {
          direction: organization_membership_request_direction_enum.REQUEST,
          status: organization_membership_request_status_enum.PENDING,
          reviewed_at: null,
          created_at: new Date(),
        },
      });
    }

    return this.prisma.organization_membership_request.create({
      data: {
        organization_id: orgId,
        user_id: currentUser.id,
        direction: organization_membership_request_direction_enum.REQUEST,
      },
    });
  }

  private async acceptPendingRecordAsMember(
    recordId: number,
    userId: number,
    orgId: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Conditional update — захист від гонки: якщо між попередніми перевірками
      // і цією транзакцією юзер встиг приєднатись до іншої орг, updateMany поверне 0.
      const userUpdate = await tx.app_user.updateMany({
        where: { id: userId, organization_id: null },
        data: { organization_id: orgId },
      });

      if (userUpdate.count === 0) {
        throw new ConflictException('User already belongs to an organization');
      }

      return tx.organization_membership_request.update({
        where: { id: recordId },
        data: {
          status: organization_membership_request_status_enum.ACCEPTED,
          reviewed_at: new Date(),
        },
      });
    });
  }

  async listMembershipRequests(
    orgId: number,
    currentUser: RequestUser,
    status?: organization_membership_request_status_enum,
  ) {
    await this.validateOrganizationOwnership(orgId, currentUser);

    return this.prisma.organization_membership_request.findMany({
      where: {
        organization_id: orgId,
        direction: organization_membership_request_direction_enum.REQUEST,
        ...(status && { status }),
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            city: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  private async loadPendingRequestForOwner(
    orgId: number,
    requestId: number,
    currentUser: RequestUser,
  ) {
    await this.validateOrganizationOwnership(orgId, currentUser);

    const request =
      await this.prisma.organization_membership_request.findUnique({
        where: { id: requestId },
      });

    if (
      !request ||
      request.organization_id !== orgId ||
      request.direction !==
        organization_membership_request_direction_enum.REQUEST
    ) {
      throw new NotFoundException(
        `Membership request with ID ${requestId} not found`,
      );
    }

    if (
      request.status !== organization_membership_request_status_enum.PENDING
    ) {
      throw new BadRequestException(
        'Membership request has already been reviewed',
      );
    }

    return request;
  }

  async acceptMembershipRequest(
    orgId: number,
    requestId: number,
    currentUser: RequestUser,
  ) {
    const request = await this.loadPendingRequestForOwner(
      orgId,
      requestId,
      currentUser,
    );

    const user = await this.prisma.app_user.findUnique({
      where: { id: request.user_id },
      select: { organization_id: true },
    });

    if (user?.organization_id && user.organization_id !== orgId) {
      throw new ConflictException(
        'User already belongs to another organization',
      );
    }

    return this.acceptPendingRecordAsMember(request.id, request.user_id, orgId);
  }

  async rejectMembershipRequest(
    orgId: number,
    requestId: number,
    currentUser: RequestUser,
  ) {
    const request = await this.loadPendingRequestForOwner(
      orgId,
      requestId,
      currentUser,
    );

    return this.prisma.organization_membership_request.update({
      where: { id: request.id },
      data: {
        status: organization_membership_request_status_enum.REJECTED,
        reviewed_at: new Date(),
      },
    });
  }

  async inviteVolunteer(
    orgId: number,
    targetUserId: number,
    currentUser: RequestUser,
  ) {
    await this.validateOrganizationOwnership(orgId, currentUser);

    if (targetUserId === currentUser.id) {
      throw new BadRequestException('Cannot invite yourself');
    }

    const target = await this.prisma.app_user.findUnique({
      where: { id: targetUserId },
      select: { id: true, role: true, organization_id: true },
    });

    if (!target) {
      throw new NotFoundException(`User with ID ${targetUserId} not found`);
    }

    if (target.role !== user_role_enum.VOLUNTEER) {
      throw new BadRequestException('Only volunteers can be invited');
    }

    if (target.organization_id) {
      throw new ConflictException('User already belongs to an organization');
    }

    const existing =
      await this.prisma.organization_membership_request.findUnique({
        where: {
          organization_id_user_id: {
            organization_id: orgId,
            user_id: targetUserId,
          },
        },
      });

    if (existing) {
      if (
        existing.status === organization_membership_request_status_enum.PENDING
      ) {
        if (
          existing.direction ===
          organization_membership_request_direction_enum.REQUEST
        ) {
          return this.acceptPendingRecordAsMember(
            existing.id,
            targetUserId,
            orgId,
          );
        }

        throw new ConflictException('Invitation already sent to this user');
      }

      return this.prisma.organization_membership_request.update({
        where: { id: existing.id },
        data: {
          direction: organization_membership_request_direction_enum.INVITE,
          status: organization_membership_request_status_enum.PENDING,
          reviewed_at: null,
          created_at: new Date(),
        },
      });
    }

    return this.prisma.organization_membership_request.create({
      data: {
        organization_id: orgId,
        user_id: targetUserId,
        direction: organization_membership_request_direction_enum.INVITE,
      },
    });
  }

  async listOrganizationInvitations(
    orgId: number,
    currentUser: RequestUser,
    status?: organization_membership_request_status_enum,
  ) {
    await this.validateOrganizationOwnership(orgId, currentUser);

    return this.prisma.organization_membership_request.findMany({
      where: {
        organization_id: orgId,
        direction: organization_membership_request_direction_enum.INVITE,
        ...(status && { status }),
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            city: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async listMyInvitations(currentUser: RequestUser) {
    return this.prisma.organization_membership_request.findMany({
      where: {
        user_id: currentUser.id,
        direction: organization_membership_request_direction_enum.INVITE,
        status: organization_membership_request_status_enum.PENDING,
      },
      include: {
        organization: {
          select: { id: true, name: true, description: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  private async loadPendingInvitationForInvitee(
    invitationId: number,
    currentUser: RequestUser,
  ) {
    const invitation =
      await this.prisma.organization_membership_request.findUnique({
        where: { id: invitationId },
      });

    if (
      !invitation ||
      invitation.direction !==
        organization_membership_request_direction_enum.INVITE ||
      invitation.user_id !== currentUser.id
    ) {
      throw new NotFoundException(
        `Invitation with ID ${invitationId} not found`,
      );
    }

    if (
      invitation.status !== organization_membership_request_status_enum.PENDING
    ) {
      throw new BadRequestException('Invitation has already been handled');
    }

    return invitation;
  }

  async acceptInvitation(invitationId: number, currentUser: RequestUser) {
    const invitation = await this.loadPendingInvitationForInvitee(
      invitationId,
      currentUser,
    );

    const user = await this.prisma.app_user.findUnique({
      where: { id: currentUser.id },
      select: { organization_id: true },
    });

    if (user?.organization_id) {
      throw new ConflictException(
        'You already belong to an organization. Leave it before accepting.',
      );
    }

    return this.acceptPendingRecordAsMember(
      invitation.id,
      invitation.user_id,
      invitation.organization_id,
    );
  }

  async rejectInvitation(invitationId: number, currentUser: RequestUser) {
    const invitation = await this.loadPendingInvitationForInvitee(
      invitationId,
      currentUser,
    );

    return this.prisma.organization_membership_request.update({
      where: { id: invitation.id },
      data: {
        status: organization_membership_request_status_enum.REJECTED,
        reviewed_at: new Date(),
      },
    });
  }

  async removeMember(
    orgId: number,
    targetUserId: number,
    currentUser: RequestUser,
  ) {
    const profile = await this.validateOrganizationOwnership(
      orgId,
      currentUser,
    );

    if (targetUserId === profile.user_id) {
      throw new BadRequestException('Cannot remove the organization owner');
    }

    const target = await this.prisma.app_user.findUnique({
      where: { id: targetUserId },
      select: { id: true, organization_id: true },
    });

    if (!target || target.organization_id !== orgId) {
      throw new NotFoundException('User is not a member of this organization');
    }

    return this.prisma.app_user.update({
      where: { id: targetUserId },
      data: { organization_id: null },
    });
  }

  async leaveOrganization(orgId: number, currentUser: RequestUser) {
    const user = await this.prisma.app_user.findUnique({
      where: { id: currentUser.id },
      select: { organization_id: true },
    });

    if (!user?.organization_id || user.organization_id !== orgId) {
      throw new BadRequestException(
        'You are not a member of this organization',
      );
    }

    return this.prisma.app_user.update({
      where: { id: currentUser.id },
      data: { organization_id: null },
    });
  }
}
