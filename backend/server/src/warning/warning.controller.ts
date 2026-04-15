import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { WarningService } from './warning.service';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { warning_status_enum, user_role_enum } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Warnings')
@Controller('warnings')
export class WarningController {
  constructor(private readonly service: WarningService) {}

  @Get()
  @ApiBearerAuth()
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Отримати свої попередження (тільки власні)' })
  @ApiQuery({ name: 'status', enum: warning_status_enum, required: false })
  async findAll(
    @CurrentUser() currentUser: { id: number; role: user_role_enum },
    @Query('status') status?: warning_status_enum,
  ) {
    return this.service.findAll(currentUser, status);
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Отримати попередження за ID (тільки власне)' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: { id: number; role: user_role_enum },
  ) {
    return this.service.findOne(id, currentUser);
  }
}
