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

    const wantsComplete = data.status === task_assignment_status_enum.COMPLETED;

    return this.prisma.$transaction(async (tx) => {
      let completedJustNow = false;

      if (wantsComplete) {
        const res = await tx.task_assignment.updateMany({
          where: { id, completed_at: null },
          data: {
            status: data.status,
            comment: data.comment,
            completed_at: new Date(),
          },
        });
        completedJustNow = res.count === 1;

        if (!completedJustNow) {
          await tx.task_assignment.update({
            where: { id },
            data: { status: data.status, comment: data.comment },
          });
        }
      } else {
        await tx.task_assignment.update({
          where: { id },
          data: {
            status: data.status,
            comment: data.comment,
            accepted_at:
              data.status === task_assignment_status_enum.ACCEPTED &&
              !assignment.accepted_at
                ? new Date()
                : undefined,
          },
        });
      }

      if (completedJustNow) {
        const fresh = await tx.task_assignment.findUnique({
          where: { id },
          select: {
            requester_confirmed: true,
            task: { select: { points_reward_base: true, title: true } },
          },
        });

        if (fresh?.requester_confirmed && fresh.task.points_reward_base > 0) {
          await this.pointsService.createTransaction(
            currentUser.id,
            points_transaction_type_enum.EARN,
            fresh.task.points_reward_base,
            `Task "${fresh.task.title}" completed`, //meow <3
            id,
          );
        }
      }

      return tx.task_assignment.findUnique({ where: { id } });
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
