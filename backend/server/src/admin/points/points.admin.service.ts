import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateManualPointsDto } from './dto/create-manual-points.dto';
import { points_transaction_type_enum } from '@prisma/client';

@Injectable()
export class PointsAdminService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(
    userId?: number,
    type?: points_transaction_type_enum,
    limit = 10,
    skip = 0,
  ) {
    const where = {
      ...(userId && { user_id: userId }),
      ...(type && { type }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.points_transaction.findMany({
        where,
        take: limit,
        skip,
        orderBy: { created_at: 'desc' },
        include: {
          app_user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.points_transaction.count({ where }),
    ]);
    return { data, total };
  }
  async addManualPoints(dto: CreateManualPointsDto) {
    const user = await this.prisma.app_user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException(`Користувача з ID ${dto.userId} не знайдено`);
    }
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.points_transaction.create({
        data: {
          user_id: dto.userId,
          amount: dto.amount,
          type: dto.type,
          reason: dto.comment,
        },
      });
      await tx.app_user.update({
        where: { id: dto.userId },
        data: {
          points: {
            increment:
              dto.type === points_transaction_type_enum.PENALTY
                ? -dto.amount
                : dto.amount,
          },
        },
      });
      return transaction;
    });
  }
}
