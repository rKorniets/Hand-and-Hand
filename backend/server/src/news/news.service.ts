import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async getNews(limit: number, skip: number, isPinned?: boolean) {
    const whereClause: { is_pinned?: boolean } = {};
    if (isPinned !== undefined) {
      whereClause.is_pinned = isPinned;
    }

    return this.prisma.news.findMany({
      where: whereClause,
      take: limit,
      skip: skip,
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async createNews(data: CreateNewsDto) {
    return this.prisma.news.create({
      data: {
        title: data.title,
        description: data.description,
        main_content: data.main_content,
        image_url: data.image_url,
        is_pinned: data.is_pinned ?? false,
        created_by: data.created_by,
      },
    });
  }

  async updateNewsFull(id: number, data: CreateNewsDto) {
    return this.prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        main_content: data.main_content,
        image_url: data.image_url,
        is_pinned: data.is_pinned,
        created_by: data.created_by,
      },
    });
  }

  async deleteNews(id: number) {
    return this.prisma.news.delete({ where: { id } });
  }
}
