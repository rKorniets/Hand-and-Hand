import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipientProfileDto } from './dto/create_recipient_profile.dto';
import { UpdateRecipientProfileDto } from './dto/update_recipient_profile.dto';

@Injectable()
export class RecipientProfileService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRecipientProfileDto) {
    return this.prisma.recipient_profile.create({ data });
  }

  async findAll() {
    return this.prisma.recipient_profile.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.recipient_profile.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateRecipientProfileDto) {
    return this.prisma.recipient_profile.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.recipient_profile.delete({
      where: { id },
    });
  }
}
