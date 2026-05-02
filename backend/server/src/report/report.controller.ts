import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  ParseEnumPipe,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { report_type_enum, user_role_enum, report } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('Reports')
@Controller('reports')
@SkipThrottle()
export class ReportController extends AbstractCrudController<report[]> {
  constructor(private readonly service: ReportService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll(undefined, limit, skip, search),
    } as unknown as IBaseCrudService<report[]>);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Отримати список звітів' })
  @ApiQuery({ name: 'type', enum: report_type_enum, required: false })
  async getReports(
    @Query() query: PaginationDto,
    @Query('type', new ParseEnumPipe(report_type_enum, { optional: true }))
    type?: report_type_enum,
  ) {
    return this.service.findAll(
      type,
      query.limit ?? 5,
      query.skip ?? 0,
      query.search,
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати звіт за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Створити новий звіт' })
  async create(
    @Body() data: CreateReportDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.create(data, user.id);
  }

  @Patch(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Оновити існуючий звіт' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateReportDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.update(id, data, { id: user.id });
  }

  @Put(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Замінити звіт повністю' })
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateReportDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.update(id, data, { id: user.id });
  }

  @Delete(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Видалити звіт' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.remove(id, { id: user.id });
  }
}
