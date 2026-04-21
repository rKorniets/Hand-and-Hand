import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ReportAdminService } from './report.admin.service';
import { CreateReportDto } from '../../report/dto/create-report.dto';
import { UpdateReportDto } from '../../report/dto/update-report.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum, report_type_enum, report } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Адмін — Звіти')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/reports')
export class ReportAdminController extends AbstractCrudController<report[]> {
  constructor(private readonly service: ReportAdminService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll({ limit, skip, search }),
    } as unknown as IBaseCrudService<report[]>);
  }

  @Get()
  @ApiOperation({ summary: 'Список всіх звітів' })
  @ApiQuery({ name: 'type', enum: report_type_enum, required: false })
  async getReports(
    @Query() paginationQuery: PaginationDto,
    @Query('type') type?: report_type_enum,
  ) {
    return this.service.findAll({
      type,
      limit: paginationQuery.limit ?? 10,
      skip: paginationQuery.skip ?? 0,
      search: paginationQuery.search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі звіту' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити звіт' })
  async create(@Body() data: CreateReportDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити звіт' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateReportDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити звіт' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
