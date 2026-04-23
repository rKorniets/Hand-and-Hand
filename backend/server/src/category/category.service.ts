import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    limit?: number,
    skip?: number,
    search?: string,
    context?: string,
  ) {
    const where: Prisma.categoryWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (context === 'news') {
      where.news_category = { some: {} };
    } else if (context === 'tasks') {
      where.task_category = { some: {} };
    } else if (context === 'organizations') {
      where.organization_category = { some: {} };
    } else if (context === 'fundraising') {
      where.fundraising_category = { some: {} };
    } else if (context === 'projects') {
      where.project_category = { some: {} };
    }

    return this.prisma.category.findMany({
      where,
      take: limit,
      skip,
      orderBy: { name: 'asc' },
    });
  }
  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }
}
