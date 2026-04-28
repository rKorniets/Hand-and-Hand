import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PointsService } from './points.service';
import { PointsQueryDto } from './dto/points-query.dto';
import { user_role_enum } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AbstractCrudController } from '../common/controllers/abstract-crud.controller';

@ApiTags('Points')
@ApiBearerAuth()
@Controller('points')
export class PointsController extends AbstractCrudController<{
  data: any[];
  total: number;
}> {
  constructor(private readonly pointsService: PointsService) {
    super(pointsService);
  }

  @Get('my')
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Отримати історію своїх транзакцій балів' })
  getMyTransactions(
    @CurrentUser() user: { id: number },
    @Query() query: PointsQueryDto,
  ) {
    return this.pointsService.getMyTransactions(user.id, query);
  }

  @Get('my/balance')
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Отримати свій поточний баланс балів' })
  getMyBalance(@CurrentUser() user: { id: number }) {
    return this.pointsService.getMyBalance(user.id);
  }
}
