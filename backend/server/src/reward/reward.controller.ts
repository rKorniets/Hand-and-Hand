import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RewardService } from './reward.service';
import { Public } from '../auth/decorators/public.decorator';
import { RewardRedemptionService } from './reward-redemption.service';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';
import { reward, user_role_enum } from '@prisma/client';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Нагороди (Rewards)')
@Controller('rewards')
@SkipThrottle()
export class RewardController extends AbstractCrudController<reward[]> {
  constructor(
    private readonly service: RewardService,
    private readonly redemptionService: RewardRedemptionService,
  ) {
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
  @Get('my-redemptions')
  @ApiBearerAuth()
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Мої отримані нагороди' })
  async getMyRedemptions(@CurrentUser() user: { id: number }) {
    return this.redemptionService.getMyRedemptions(user.id);
  }
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати нагороду за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
  @Post(':id/redeem')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // ← throttle на мутацію
  @ApiBearerAuth()
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Обміняти бали на нагороду' })
  async redeem(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.redemptionService.redeem(user.id, id);
  }
}
