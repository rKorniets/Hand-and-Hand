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
import { CreateReportAdminDto } from './dto/create-report.admin.dto';
import { UpdateReportDto } from '../../report/dto/update-report.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum, report_type_enum } from '@prisma/client';

@ApiTags('Адмін — Звіти')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/reports')
export class ReportAdminController {
  constructor(private readonly service: ReportAdminService) {}

  @Get()
  @ApiOperation({ summary: 'Список всіх звітів' })
  @ApiQuery({ name: 'type', enum: report_type_enum, required: false })
  async findAll(@Query('type') type?: report_type_enum) {
    return this.service.findAll(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі звіту' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити звіт' })
  async create(@Body() data: CreateReportAdminDto) {
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
