import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  ParseEnumPipe,
} from '@nestjs/common';
import { WarningService } from './warning.service';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { warning_status_enum, user_role_enum, warnings } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';

export interface AuthUser {
  id: number;
  role: user_role_enum;
}

@ApiTags('Warnings')
@ApiBearerAuth()
@Roles(user_role_enum.VOLUNTEER)
@Controller('warnings')
export class WarningController extends AbstractCrudController<warnings[]> {
  constructor(private readonly service: WarningService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll(
          { id: 0, role: user_role_enum.VOLUNTEER },
          undefined,
          limit,
          skip,
          search,
        ),
    } as unknown as IBaseCrudService<warnings[]>);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати свої попередження' })
  @ApiQuery({
    name: 'status',
    enum: warning_status_enum,
    required: false,
  })
  async getWarnings(
    @CurrentUser() currentUser: AuthUser,
    @Query() query: PaginationDto,
    @Query('status', new ParseEnumPipe(warning_status_enum, { optional: true }))
    status?: warning_status_enum,
  ) {
    return this.service.findAll(
      currentUser,
      status,
      query.limit ?? 5,
      query.skip ?? 0,
      query.search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати попередження за ID (тільки власне)' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.service.findOne(id, currentUser);
  }
}
