import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum, reward } from '@prisma/client';
import { RewardService } from '../../reward/reward.service';
import { CreateRewardDto } from '../../reward/dto/create-reward.dto';
import { UpdateRewardDto } from '../../reward/dto/update-reward.dto';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Адмін — Нагороди')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/rewards')
export class RewardAdminController extends AbstractCrudController<reward[]> {
  constructor(private readonly service: RewardService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll(limit, skip, search),
    } as unknown as IBaseCrudService<reward[]>);
  }

  @Get()
  @ApiOperation({ summary: 'Список усіх нагород' })
  async getRewards(@Query() query: PaginationDto) {
    return this.service.findAll(
      query.limit ?? 10,
      query.skip ?? 0,
      query.search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі нагороди' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити нагороду' })
  async create(@Body() data: CreateRewardDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити нагороду' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRewardDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити нагороду' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
