import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Нагороди (Rewards)')
@ApiBearerAuth()
@Controller('rewards')
export class RewardController {
  constructor(private readonly service: RewardService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Отримати список усіх нагород' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати нагороду за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Створити нову нагороду' })
  async create(@Body() data: CreateRewardDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Оновити нагороду' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRewardDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Видалити нагороду' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
