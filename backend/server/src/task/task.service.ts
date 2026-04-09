import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create_task.dto';
import { UpdateTaskDto } from './dto/update_task.dto';
import { Prisma } from '@prisma/client';

export interface RequestUser {
  id: number;
}

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateTaskOwnership(taskId: number, currentUser: RequestUser) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: { organization_profile: { select: { user_id: true } } },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`task with ID ${taskId} was not found`);
    }

    if (task.project.organization_profile.user_id !== currentUser.id) {
      throw new ForbiddenException('You don\'t have permission to perform this task.' );
    }

    return task;
  }

  async create(data: CreateTaskDto, currentUser: RequestUser) {
    const project = await this.prisma.project.findUnique({
      where: { id: data.project_id },
      include: { organization_profile: { select: { user_id: true } } },
    });

    if (!project) {
      throw new NotFoundException(`Проєкт з ID ${data.project_id} не знайдено`);
    }

    if (project.organization_profile.user_id !== currentUser.id) {
      throw new ForbiddenException('Ви не маєте прав створювати задачі для цього проєкту');
    }

    return this.prisma.task.create({
      data: {
        project_id: data.project_id,
        ticket_id: data.ticket_id,
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        points_reward_base: data.points_reward_base,
        location_id: data.location_id,
        deadline: data.deadline,
      },
    });
  }

  async findAll() {
    return this.prisma.task.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        project: true,
        ticket: true,
        location: true,
        task_category: {
          include: { category: true },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        ticket: true,
        location: true,
        task_category: {
          include: { category: true },
        },
        task_assignment: true,
      },
    });
  }

  async update(id: number, data: UpdateTaskDto, currentUser: RequestUser) {
    await this.validateTaskOwnership(id, currentUser);

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.difficulty && { difficulty: data.difficulty }),
        ...(data.points_reward_base !== undefined && { points_reward_base: data.points_reward_base }),
        ...(data.location_id !== undefined && { location_id: data.location_id }),
        ...(data.deadline !== undefined && { deadline: data.deadline }),
      },
    });
  }

  async remove(id: number, currentUser: RequestUser) {
    await this.validateTaskOwnership(id, currentUser);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
