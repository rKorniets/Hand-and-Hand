import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { WarningAdminService } from './warning.admin.service';
import { CreateWarningAdminDto } from './dto/create-warning.admin.dto';
import { WarningQueryAdminDto } from './dto/warning-query.admin.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { user_role_enum, warnings } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../../common/dto/pagination.dto';
import type { AuthAdmin } from '../approval/approval.admin.controller'; // Для ідеальної типізації

@ApiTags('Адмін — Попередження')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/warnings')
export class WarningAdminController extends AbstractCrudController<warnings[]> {
  constructor(private readonly service: WarningAdminService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll({ limit, skip, search } as WarningQueryAdminDto),
    } as unknown as IBaseCrudService<warnings[]>);
  }

  @Get()
  @ApiOperation({ summary: 'Список усіх попереджень' })
  async getWarnings(
    @Query() paginationQuery: PaginationDto,
    @Query() warningQuery: WarningQueryAdminDto,
  ) {
    return this.service.findAll({
      ...warningQuery,
      limit: paginationQuery.limit ?? 10,
      skip: paginationQuery.skip ?? 0,
      search: paginationQuery.search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі попередження' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Видати попередження користувачу' })
  async create(
    @Body() dto: CreateWarningAdminDto,
    @CurrentUser() user: AuthAdmin,
  ) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Зняти попередження' })
  async resolve(@Param('id', ParseIntPipe) id: number) {
    return this.service.resolve(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Скасувати попередження' })
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.service.cancel(id);
  }
}
