import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NewsQueryAdminDto } from './dto/news-query.admin.dto';
import { CreateNewsDto } from '../../news/dto/create-news.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class NewsAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    params: NewsQueryAdminDto & {
      limit?: number;
      skip?: number;
      search?: string;
    },
  ) {
    const whereClause: Prisma.newsWhereInput = {
      ...(params.search && {
        title: { contains: params.search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        where: whereClause,
        take: params.limit,
        skip: params.skip,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.news.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const news = await this.prisma.news.findUnique({ where: { id } });

    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return news;
  }

  async create(data: CreateNewsDto, createdBy: number) {
    return this.prisma.news.create({
      data: {
        title: data.title,
        description: data.description,
        main_content: data.main_content,
        image_url: data.image_url,
        created_by: createdBy,
        is_pinned: false,
      },
    });
  }

  async update(id: number, data: CreateNewsDto) {
    await this.findOne(id);

    return this.prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        main_content: data.main_content,
        image_url: data.image_url,
      },
    });
  }

  async togglePin(id: number) {
    const news = await this.findOne(id);

    return this.prisma.news.update({
      where: { id },
      data: { is_pinned: !news.is_pinned },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.news.delete({ where: { id } });
  }
}
