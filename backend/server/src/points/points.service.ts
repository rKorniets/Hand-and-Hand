import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PointsQueryDto } from './dto/points-query.dto';
import {
  points_transaction_type_enum,
  points_transaction,
  Prisma,
} from '@prisma/client';
import { IBaseCrudService } from '../common/controllers/abstract-crud.controller';

@Injectable()
export class PointsService implements IBaseCrudService<{
  data: points_transaction[];
  total: number;
}> {
  constructor(private prisma: PrismaService) {}

  async findAll(limit = 5, skip = 0, search?: string) {
    const where: Prisma.points_transactionWhereInput = search
      ? { reason: { contains: search, mode: 'insensitive' } }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.points_transaction.findMany({
        where,
        take: limit,
        skip: skip,
        orderBy: { created_at: 'desc' },
        include: {
          app_user: {
            select: { email: true, first_name: true, last_name: true },
          },
        },
      }),
      this.prisma.points_transaction.count({ where }),
    ]);

    return { data, total };
  }

  async getMyTransactions(userId: number, query: PointsQueryDto) {
    const { limit = 5, skip = 0, type, search } = query;

    const where: Prisma.points_transactionWhereInput = { user_id: userId };

    if (type) where.type = type;
    if (search) where.reason = { contains: search, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.points_transaction.findMany({
        where,
        take: limit,
        skip: skip,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.points_transaction.count({ where }),
    ]);

    return { data, total };
  }

  async getMyBalance(userId: number) {
    const user = await this.prisma.app_user.findUnique({
      where: { id: userId },
      select: { points: true },
    });

    if (!user) throw new NotFoundException('Користувача не знайдено');

    return { points: user.points };
  }

  async createTransaction(
    userId: number,
    type: points_transaction_type_enum,
    amount: number,
    reason: string,
    taskAssignmentId?: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.points_transaction.create({
        data: {
          user_id: userId,
          type,
          amount: Math.abs(amount),
          reason,
          task_assignment_id: taskAssignmentId,
        },
      });

      let pointDelta = Math.abs(amount);
      if (type === 'SPEND' || type === 'PENALTY') pointDelta = -pointDelta;

      await tx.app_user.update({
        where: { id: userId },
        data: { points: { increment: pointDelta } },
      });

      return transaction;
    });
  }
}
