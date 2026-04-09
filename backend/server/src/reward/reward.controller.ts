import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RewardService } from './reward.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Нагороди (Rewards)')
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
}
