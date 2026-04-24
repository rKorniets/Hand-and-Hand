import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create_location.dto';
import { UpdateLocationDto } from './dto/update_location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateLocationDto) {
    return this.prisma.location.create({
      data: {
        city: data.city,
        address: data.address,
        region: data.region,
        lat: data.lat ?? 0,
        lng: data.lng ?? 0,
      },
    });
  }

  async findAll(limit?: number, skip?: number, search?: string) {
    const whereClause: Prisma.locationWhereInput = search
      ? { city: { contains: search, mode: 'insensitive' } }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.location.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { city: 'asc' },
      }),
      this.prisma.location.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const location = await this.prisma.location.findUnique({ where: { id } });
    if (!location)
      throw new NotFoundException(`Location with ID ${id} not found`);
    return location;
  }

  async update(id: number, data: UpdateLocationDto) {
    await this.findOne(id);
    return this.prisma.location.update({
      where: { id },
      data: {
        city: data.city,
        address: data.address,
        region: data.region,
        lat: data.lat,
        lng: data.lng,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.location.delete({ where: { id } });
  }

  async getCities(): Promise<string[]> {
    const locations = await this.prisma.location.findMany({
      select: { city: true },
      distinct: ['city'],
      orderBy: { city: 'asc' },
    });
    return locations.map((l) => l.city);
  }
}
