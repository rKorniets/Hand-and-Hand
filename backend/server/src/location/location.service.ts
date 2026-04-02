import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create_location.dto';
import { UpdateLocationDto } from './dto/update_location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateLocationDto) {
    return this.prisma.location.create({ data });
  }

  async findAll() {
    return this.prisma.location.findMany({
      orderBy: { city: 'asc' },
    });
  }

  async findOne(id: number) {
    const location = await this.prisma.location.findUnique({ where: { id } });

    if (!location) {
      throw new NotFoundException(`Локацію з ID ${id} не знайдено`);
    }

    return location;
  }

  async update(id: number, data: UpdateLocationDto) {
    await this.findOne(id);

    return this.prisma.location.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.location.delete({ where: { id } });
  }
}
