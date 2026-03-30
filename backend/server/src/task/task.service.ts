import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create_task.dto';
import { UpdateTaskDto } from './dto/update_task.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTaskDto) {
    return this.prisma.task.create({
      data,
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

  async update(id: number, data: UpdateTaskDto) {
    const updateData: Prisma.taskUpdateInput = { ...data };

    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
