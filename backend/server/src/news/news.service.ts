import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async getNews(limit: number, isPinned?: boolean) {
    const whereClause: { is_pinned?: boolean } = {};

    if (isPinned !== undefined) {
      whereClause.is_pinned = isPinned;
    }

    return this.prisma.news.findMany({
      where: whereClause,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
