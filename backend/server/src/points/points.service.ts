import { Injectable } from '@nestjs/common';
import { Prisma, points_transaction_type_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(
    userId: number,
    type: points_transaction_type_enum,
    amount: number,
    taskAssignmentId: number | null,
    reason: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    const delta = type === points_transaction_type_enum.EARN ? amount : -amount;

    const [transaction] = await Promise.all([
      client.points_transaction.create({
        data: {
          user_id: userId,
          task_assignment_id: taskAssignmentId,
          amount,
          type,
          reason,
        },
      }),
      client.app_user.update({
        where: { id: userId },
        data: { points: { increment: delta } },
      }),
    ]);

    return transaction;
  }
}
