import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
  ParseEnumPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { PointsAdminService } from './points.admin.service';
import { CreateManualPointsDto } from './dto/create-manual-points.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { points_transaction_type_enum, user_role_enum } from '@prisma/client';

@ApiTags('Адмін — Бали')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/points')
export class PointsAdminController {
  constructor(private readonly service: PointsAdminService) {}

  @Get()
  @ApiOperation({ summary: 'Список всіх транзакцій балів' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({
    name: 'type',
    enum: points_transaction_type_enum,
    required: false,
  })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  async findAll(
    @Query(
      'userId',
      new DefaultValuePipe(undefined),
      new ParseIntPipe({ optional: true }),
    )
    userId?: number,
    @Query(
      'type',
      new ParseEnumPipe(points_transaction_type_enum, { optional: true }),
    )
    type?: points_transaction_type_enum,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
  ) {
    return this.service.findAll(userId, type, limit, skip);
  }

  @Post()
  @ApiOperation({ summary: 'Ручне нарахування балів' })
  async addManualPoints(@Body() dto: CreateManualPointsDto) {
    return this.service.addManualPoints(dto);
  }
}
