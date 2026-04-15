import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskAssignmentAdminDto } from './dto/create-task-assignment.admin.dto';
import { UpdateTaskAssignmentAdminDto } from './dto/update-task-assignment.admin.dto';
import { Prisma, task_assignment_status_enum } from '@prisma/client';

@Injectable()
export class TaskAssignmentAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(limit: number, skip: number, taskId?: number, volunteerId?: number) {
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

    return this.prisma.task_assignment.update({
      where: { id },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.comment !== undefined && { comment: data.comment }),
        ...(data.requester_confirmed !== undefined && { requester_confirmed: data.requester_confirmed }),
        ...(data.status === task_assignment_status_enum.ACCEPTED && !assignment.accepted_at && { accepted_at: new Date() }),
        ...(data.status === task_assignment_status_enum.COMPLETED && !assignment.completed_at && { completed_at: new Date() }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.task_assignment.delete({ where: { id } });
  }
}
