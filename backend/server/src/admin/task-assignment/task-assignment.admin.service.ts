import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PointsService } from '../../points/points.service';
import { CreateTaskAssignmentAdminDto } from './dto/create-task-assignment.admin.dto';
import { UpdateTaskAssignmentAdminDto } from './dto/update-task-assignment.admin.dto';
import {
  Prisma,
  points_transaction_type_enum,
  task_assignment_status_enum,
} from '@prisma/client';

@Injectable()
export class TaskAssignmentAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pointsService: PointsService,
  ) {}

  async findAll(
    limit: number,
    skip: number,
    taskId?: number,
    volunteerId?: number,
  ) {
    const where: Prisma.task_assignmentWhereInput = {
      ...(taskId && { task_id: taskId }),
      ...(volunteerId && { volunteer_profile_id: volunteerId }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task_assignment.findMany({
        where,
        take: limit,
        skip,
        orderBy: { created_at: 'desc' },
        include: {
          task: { select: { id: true, title: true, status: true } },
          volunteer_profile: { select: { id: true, display_name: true } },
        },
      }),
      this.prisma.task_assignment.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const assignment = await this.prisma.task_assignment.findUnique({
      where: { id },
      include: {
        task: true,
        volunteer_profile: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Task assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async create(data: CreateTaskAssignmentAdminDto) {
    return this.prisma.task_assignment.create({
      data: {
        task_id: data.task_id,
        volunteer_profile_id: data.volunteer_profile_id,
        status: data.status,
        comment: data.comment,
        requester_confirmed: data.requester_confirmed ?? false,
      },
    });
  }

  async update(id: number, data: UpdateTaskAssignmentAdminDto) {
    const assignment = await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      const nextStatus = data.status ?? assignment.status;
      const nextConfirmed =
        data.requester_confirmed ?? assignment.requester_confirmed;

      const isBecomingCompleted =
        data.status === task_assignment_status_enum.COMPLETED &&
        !assignment.completed_at;

      let completedJustNow = false;

      if (isBecomingCompleted) {
        const res = await tx.task_assignment.updateMany({
          where: { id, completed_at: null },
          data: {
            status: data.status,
            ...(data.comment !== undefined && { comment: data.comment }),
            ...(data.requester_confirmed !== undefined && {
              requester_confirmed: data.requester_confirmed,
            }),
            completed_at: new Date(),
          },
        });
        completedJustNow = res.count === 1;

        if (!completedJustNow) {
          await tx.task_assignment.update({
            where: { id },
            data: {
              ...(data.status !== undefined && { status: data.status }),
              ...(data.comment !== undefined && { comment: data.comment }),
              ...(data.requester_confirmed !== undefined && {
                requester_confirmed: data.requester_confirmed,
              }),
            },
          });
        }
      } else {
        await tx.task_assignment.update({
          where: { id },
          data: {
            ...(data.status !== undefined && { status: data.status }),
            ...(data.comment !== undefined && { comment: data.comment }),
            ...(data.requester_confirmed !== undefined && {
              requester_confirmed: data.requester_confirmed,
            }),
            ...(data.status === task_assignment_status_enum.ACCEPTED &&
              !assignment.accepted_at && { accepted_at: new Date() }),
          },
        });
      }

      // Чи слід нараховувати: щойно завершили АБО підтвердили уже-COMPLETED + перевірка чи вже давали нагороду
      const shouldAward =
        nextStatus === task_assignment_status_enum.COMPLETED &&
        nextConfirmed === true &&
        (completedJustNow ||
          (assignment.completed_at !== null &&
            assignment.requester_confirmed === false &&
            data.requester_confirmed === true));

      if (shouldAward) {
        const alreadyAwarded = await tx.points_transaction.findFirst({
          where: {
            task_assignment_id: id,
            type: points_transaction_type_enum.EARN,
          },
          select: { id: true },
        });

        if (!alreadyAwarded) {
          const amount = assignment.task.points_reward_base;
          const userId = assignment.volunteer_profile.user_id;
          if (amount > 0) {
            await this.pointsService.createTransaction(
              userId,
              points_transaction_type_enum.EARN,
              amount,
              id,
              `Task "${assignment.task.title}" completed`,
              tx,
            );
          }
        }
      }

      return tx.task_assignment.findUnique({ where: { id } });
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.task_assignment.delete({ where: { id } });
  }
}
