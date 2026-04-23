import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  points_transaction_type_enum,
  task_assignment_status_enum,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PointsService } from '../points/points.service';
import { CreateTaskAssignmentDto } from './dto/create_task_assignment.dto';
import { UpdateTaskAssignmentDto } from './dto/update_task_assignment.dto';

export interface RequestUser {
  id: number;
}

@Injectable()
export class TaskAssignmentService {
  constructor(
    private prisma: PrismaService,
    private pointsService: PointsService,
  ) {}

  private async validateVolunteerOwnership(
    volunteerProfileId: number,
    currentUser: RequestUser,
  ) {
    const profile = await this.prisma.volunteer_profile.findUnique({
      where: { id: volunteerProfileId },
    });

    if (!profile) {
      throw new NotFoundException('Volunteer profile not found');
    }

    if (profile.user_id !== currentUser.id) {
      throw new ForbiddenException(
        'You can only manage your own task assignments',
      );
    }

    return true;
  }

  async create(data: CreateTaskAssignmentDto, currentUser: RequestUser) {
    const profile = await this.prisma.volunteer_profile.findUnique({
      where: { user_id: currentUser.id },
    });

    if (!profile) {
      throw new NotFoundException('Volunteer profile not found');
    }

    return this.prisma.task_assignment.create({
      data: {
        task_id: data.task_id,
        volunteer_profile_id: profile.id,
        status: data.status,
        comment: data.comment,
        requester_confirmed: false,
      },
    });
  }

  async findAll(
    limit?: number,
    skip?: number,
    taskId?: number,
    volunteerId?: number,
    search?: string,
  ) {
    const whereClause: Prisma.task_assignmentWhereInput = {
      ...(taskId && { task_id: taskId }),
      ...(volunteerId && { volunteer_profile_id: volunteerId }),
      ...(search && {
        comment: { contains: search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task_assignment.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { created_at: 'desc' },
        include: {
          task: { select: { title: true, status: true } },
        },
      }),
      this.prisma.task_assignment.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const assignment = await this.prisma.task_assignment.findUnique({
      where: { id },
      include: { task: true, volunteer_profile: true },
    });

    if (!assignment)
      throw new NotFoundException(`Task assignment with ID ${id} not found`);
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

    const shouldAwardPoints =
      data.status === task_assignment_status_enum.COMPLETED &&
      assignment.requester_confirmed === true &&
      assignment.completed_at === null;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.task_assignment.update({
        where: { id },
        data: {
          status: data.status,
          comment: data.comment,
          requester_confirmed: assignment.requester_confirmed,
          accepted_at:
            data.status === task_assignment_status_enum.ACCEPTED &&
            !assignment.accepted_at
              ? new Date()
              : undefined,
          completed_at:
            data.status === task_assignment_status_enum.COMPLETED &&
            !assignment.completed_at
              ? new Date()
              : undefined,
        },
      });

      if (shouldAwardPoints) {
        const amount = assignment.task.points_reward_base;
        if (amount > 0) {
          await this.pointsService.createTransaction(
            currentUser.id,
            points_transaction_type_enum.EARN,
            amount,
            id,
            `Task "${assignment.task.title}" completed`,
            tx,
          );
        }
      }

      return updated;
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
