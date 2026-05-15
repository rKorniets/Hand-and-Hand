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
import { AppGateway } from '../websocket/app.gateway';

export interface RequestUser {
  id: number;
}

@Injectable()
export class NewsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private appGateway: AppGateway,
  ) {}

  private async validateOwnership(id: number, currentUser: RequestUser) {
    const news = await this.prisma.news.findUnique({ where: { id } });

    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    const user = await this.prisma.app_user.findUnique({
      where: { id: currentUser.id },
      select: { organization_id: true },
    });

    if (
      !user?.organization_id ||
      news.organization_id !== user.organization_id
    ) {
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
        include: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.news.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async getNewsById(id: number) {
    return this.prisma.news.findFirst({
      where: {
        id,
        status: news_status_enum.PUBLISHED,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async createNews(data: CreateNewsDto, currentUserId: number) {
    const user = await this.prisma.app_user.findUnique({
      where: { id: currentUserId },
      select: { organization_id: true },
    });

    if (!user || user.organization_id === null) {
      throw new ForbiddenException('Користувач не належить до організації');
    }

    const news = await this.prisma.news.create({
      data: {
        ...data,
        organization_id: user.organization_id,
        is_pinned: false,
      },
    });

    this.appGateway.sendToAll('newsCreated', news);

    return news;
  }

  async updateNewsFull(
    id: number,
    data: CreateNewsDto,
    currentUser: RequestUser,
  ) {
    await this.validateOwnership(id, currentUser);

    const updatedNews = await this.prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        main_content: data.main_content,
      },
    });

    this.appGateway.sendToAll('newsUpdated', updatedNews);

    return updatedNews;
  }

  async updateNewsPartial(
    id: number,
    data: UpdateNewsDto,
    currentUser: RequestUser,
  ) {
    await this.validateOwnership(id, currentUser);

    const updatedNews = await this.prisma.news.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.main_content && { main_content: data.main_content }),
        ...(data.image_url !== undefined && { image_url: data.image_url }),
      },
    });

    this.appGateway.sendToAll('newsUpdated', updatedNews);

    return updatedNews;
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

    const updatedNews = await this.prisma.news.update({
      where: { id },
      data: { image_url },
    });

    this.appGateway.sendToAll('newsUpdated', updatedNews);

    return { image_url };
  }

  async deleteNews(id: number, currentUser: RequestUser) {
    const existing = await this.validateOwnership(id, currentUser);

    if (existing.image_url) {
      await this.cloudinary.deleteImage(existing.image_url);
    }

    const deletedNews = await this.prisma.news.delete({ where: { id } });

    this.appGateway.sendToAll('newsDeleted', { id });

    return deletedNews;
  }
}
