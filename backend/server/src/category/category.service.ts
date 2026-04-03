import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new ConflictException('Категорія з таким slug вже існує');
    }

    return this.prisma.category.create({ data });
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Категорію з ID ${id} не знайдено`);
    }

    return category;
  }

  async update(id: number, data: UpdateCategoryDto) {
    await this.findOne(id);
    if (data.slug) {
      const existing = await this.prisma.category.findFirst({
        where: { slug: data.slug, id: { not: id } },
      });

      if (existing) {
        throw new ConflictException('Категорія з таким slug вже існує');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }
}
