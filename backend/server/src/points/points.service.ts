import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma, points_transaction_type_enum } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type TxClient = Prisma.TransactionClient;

@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) {}

  private getDelta(
    type: points_transaction_type_enum,
    amount: number,
  ): number {
    switch (type) {
      case points_transaction_type_enum.EARN:
      case points_transaction_type_enum.BONUS:
        return amount;
      case points_transaction_type_enum.SPEND:
      case points_transaction_type_enum.PENALTY:
        return -amount;
      case points_transaction_type_enum.ADJUSTMENT:
        return amount;
    }
  }

  private async write(
    client: TxClient,
    userId: number,
    type: points_transaction_type_enum,
    amount: number,
    taskAssignmentId: number | null,
    reason: string,
  ) {
    const delta = this.getDelta(type, amount);

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

  async createTransaction(
    userId: number,
    type: points_transaction_type_enum,
    amount: number,
    taskAssignmentId: number | null,
    reason: string,
    tx?: TxClient,
  ) {
    if (!Number.isInteger(amount)) {
      throw new BadRequestException('amount must be an integer');
    }
    if (type === points_transaction_type_enum.ADJUSTMENT) {
      if (amount === 0) {
        throw new BadRequestException('ADJUSTMENT amount must be non-zero');
      }
    } else if (amount <= 0) {
      throw new BadRequestException('amount must be positive');
    }

    if (tx) {
      return this.write(tx, userId, type, amount, taskAssignmentId, reason);
    }
    return this.prisma.$transaction((client) =>
      this.write(client, userId, type, amount, taskAssignmentId, reason),
    );
  }
}
