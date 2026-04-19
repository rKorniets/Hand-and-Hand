import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RewardService } from './reward.service';
import { Public } from '../auth/decorators/public.decorator';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';
import { reward } from '@prisma/client';

@ApiTags('Нагороди (Rewards)')
@Controller('rewards')
export class RewardController extends AbstractCrudController<reward[]> {
  constructor(private readonly service: RewardService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll(limit, skip, search),
    } as unknown as IBaseCrudService<reward[]>);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Отримати список усіх нагород' })
  async getRewards(@Query() query: PaginationDto) {
    return this.service.findAll(
      query.limit ?? 5,
      query.skip ?? 0,
      query.search,
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати нагороду за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
