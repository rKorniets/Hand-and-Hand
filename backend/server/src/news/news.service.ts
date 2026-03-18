import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
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
  async createNews(data: CreateNewsDto) {
    return this.prisma.news.create({
      data: {
        title: data.title,
        source_url: data.source_url,
        source_name: data.source_name,
        image_url: data.image_url,
        tags: data.tags,
        is_pinned: data.is_pinned ?? false,
      },
    });
  }
  async updateNewsFull(id: number, data: CreateNewsDto) {
    return this.prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        source_url: data.source_url,
        source_name: data.source_name,
        image_url: data.image_url,
        tags: data.tags,
        is_pinned: data.is_pinned,
      },
    });
  }
}
