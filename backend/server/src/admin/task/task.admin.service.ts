import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from '../../task/dto/create_task.dto';
import { UpdateTaskDto } from '../../task/dto/update_task.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(limit?: number, skip?: number, search?: string) {
    const whereClause: Prisma.taskWhereInput = search
      ? {
          title: { contains: search, mode: 'insensitive' },
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { created_at: 'desc' },
        include: {
          project: true,
          ticket: true,
          location: true,
          task_category: {
            include: { category: true },
          },
        },
      }),
      this.prisma.task.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
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

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  // noinspection DuplicatedCode
  async create(data: CreateTaskDto) {
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

  // noinspection DuplicatedCode
  async update(id: number, data: UpdateTaskDto) {
    await this.findOne(id);
    // noinspection DuplicatedCode
    return this.prisma.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.difficulty !== undefined && { difficulty: data.difficulty }),
        ...(data.points_reward_base !== undefined && {
          points_reward_base: data.points_reward_base,
        }),
        ...(data.location_id !== undefined && {
          location_id: data.location_id,
        }),
        ...(data.deadline !== undefined && { deadline: data.deadline }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
