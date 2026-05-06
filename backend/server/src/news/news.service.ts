import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Prisma, news_status_enum } from '@prisma/client';
import { CloudinaryService, ImageType } from '../cloudinary/cloudinary.service';

export interface RequestUser {
  id: number;
}

@Injectable()
export class NewsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  private async validateOwnership(id: number, currentUser: RequestUser) {
    const news = await this.prisma.news.findUnique({ where: { id } });

    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    if (news.created_by !== currentUser.id) {
      throw new ForbiddenException('You can only edit or delete your own news');
    }

    return news;
  }

  async getNews(
    limit: number,
    skip: number,
    isPinned?: boolean,
    search?: string,
  ) {
    const whereClause: Prisma.newsWhereInput = {
      status: news_status_enum.PUBLISHED,
      ...(isPinned !== undefined && { is_pinned: isPinned }),
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { created_at: 'desc' },
        include: { organization: true },
      }),
      this.prisma.news.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async getNewsById(id: number) {
    return this.prisma.news.findUnique({
      where: { id },
    });
  }

  async createNews(data: CreateNewsDto, createdBy: number) {
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

  async updateNewsFull(
    id: number,
    data: CreateNewsDto,
    currentUser: RequestUser,
  ) {
    await this.validateOwnership(id, currentUser);

    return this.prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        main_content: data.main_content,
      },
    });
  }
  async updateNewsPartial(
    id: number,
    data: UpdateNewsDto,
    currentUser: RequestUser,
  ) {
    await this.validateOwnership(id, currentUser);

    return this.prisma.news.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.main_content && { main_content: data.main_content }),
        ...(data.image_url !== undefined && { image_url: data.image_url }),
      },
    });
  }

  async updateImage(
    id: number,
    file: Express.Multer.File,
    currentUser: RequestUser,
  ): Promise<{ image_url: string }> {
    const existing = await this.validateOwnership(id, currentUser);
    const image_url = await this.cloudinary.replaceImage(
      file,
      ImageType.NEWS,
      existing.image_url,
    );
    await this.prisma.news.update({ where: { id }, data: { image_url } });
    return { image_url };
  }
  async deleteNews(id: number, currentUser: RequestUser) {
    const existing = await this.validateOwnership(id, currentUser);
    if (existing.image_url)
      await this.cloudinary.deleteImage(existing.image_url);
    return this.prisma.news.delete({ where: { id } });
  }
}
