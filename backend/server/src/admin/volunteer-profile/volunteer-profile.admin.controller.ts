import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { VolunteerProfileAdminService } from './volunteer-profile.admin.service';
import { CreateVolunteerProfileAdminDto } from './dto/create-volunteer-profile.admin.dto';
import { CreateVolunteerProfileDto } from '../../volunteer_profile/dto/create-volunteer-profile.dto';
import { UpdateVolunteerProfileDto } from '../../volunteer_profile/dto/update-volunteer-profile.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Адмін — Профілі волонтерів')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/volunteer-profiles')
export class VolunteerProfileAdminController {
  constructor(private readonly service: VolunteerProfileAdminService) {}

  @Get()
  @ApiOperation({ summary: 'Список всіх профілів волонтерів' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі профілю волонтера' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити профіль волонтера (від імені юзера)' })
  async create(@Body() data: CreateVolunteerProfileAdminDto) {
    return this.service.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити профіль волонтера (повністю)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateVolunteerProfileDto,
  ) {
    return this.service.update(id, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Частково оновити профіль волонтера' })
  async updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateVolunteerProfileDto,
  ) {
    return this.service.updatePartial(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити профіль волонтера' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
