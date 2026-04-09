import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskAssignmentDto } from './dto/create_task_assignment.dto';
import { UpdateTaskAssignmentDto } from './dto/update_task_assignment.dto';

export interface RequestUser {
  id: number;
}

@Injectable()
export class TaskAssignmentService {
  constructor(private prisma: PrismaService) {}

  private async validateVolunteerOwnership(
    volunteerProfileId: number,
    currentUser: RequestUser,
  ) {
    const profile = await this.prisma.volunteer_profile.findUnique({
      where: { id: volunteerProfileId },
    });

    if (!profile) {
      throw new NotFoundException('Профіль волонтера не знайдено');
    }

    if (profile.user_id !== currentUser.id) {
      throw new ForbiddenException(
        'Ви можете керувати лише своїми призначеннями на завдання',
      );
    }

    return true;
  }

  async create(data: CreateTaskAssignmentDto, currentUser: RequestUser) {
    await this.validateVolunteerOwnership(
      data.volunteer_profile_id,
      currentUser,
    );

    return this.prisma.task_assignment.create({
      data: {
        task_id: data.task_id,
        volunteer_profile_id: data.volunteer_profile_id,
        status: data.status,
        comment: data.comment,
        requester_confirmed: false,
      },
    });
  }

  async findAll(
    limit: number,
    skip: number,
    taskId?: number,
    volunteerId?: number,
  ) {
    const whereClause: Prisma.task_assignmentWhereInput = {};
    if (taskId) whereClause.task_id = taskId;
    if (volunteerId) whereClause.volunteer_profile_id = volunteerId;

    return this.prisma.task_assignment.findMany({
      where: whereClause,
      take: limit,
      skip: skip,
      orderBy: { created_at: 'desc' },
      include: {
        task: { select: { title: true, status: true } },
      },
    });
  }

  async findOne(id: number) {
    const assignment = await this.prisma.task_assignment.findUnique({
      where: { id },
      include: { task: true, volunteer_profile: true },
    });

    if (!assignment)
      throw new NotFoundException(`Призначення з ID ${id} не знайдено`);
    return assignment;
  }

  async update(
    id: number,
    data: UpdateTaskAssignmentDto,
    currentUser: RequestUser,
  ) {
    const assignment = await this.findOne(id);
    await this.validateVolunteerOwnership(
      assignment.volunteer_profile_id,
      currentUser,
    );

    return this.prisma.task_assignment.update({
      where: { id },
      data: {
        status: data.status,
        comment: data.comment,
        requester_confirmed: assignment.requester_confirmed,
        accepted_at:
          data.status === 'ACCEPTED' && !assignment.accepted_at
            ? new Date()
            : undefined,
        completed_at:
          data.status === 'COMPLETED' && !assignment.completed_at
            ? new Date()
            : undefined,
      },
    });
  }

  async remove(id: number, currentUser: RequestUser) {
    const assignment = await this.findOne(id);
    await this.validateVolunteerOwnership(
      assignment.volunteer_profile_id,
      currentUser,
    );

    return this.prisma.task_assignment.delete({ where: { id } });
  }
}
