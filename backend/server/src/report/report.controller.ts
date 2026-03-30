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
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { report_type_enum } from '@prisma/client';

@ApiTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly service: ReportService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список звітів' })
  @ApiQuery({ name: 'type', enum: report_type_enum, required: false })
  async findAll(@Query('type') type?: report_type_enum) {
    return this.service.findAll(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати звіт за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити новий звіт' })
  async create(@Body() data: CreateReportDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити існуючий звіт' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateReportDto,
  ) {
    return this.service.update(id, data);
  }
  @Put(':id')
  @ApiOperation({ summary: 'Замінити звіт повністю' })
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateReportDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити звіт' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
