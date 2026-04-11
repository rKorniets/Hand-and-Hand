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
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { report_type_enum, user_role_enum } from '@prisma/client';

@ApiTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly service: ReportService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Отримати список звітів' })
  @ApiQuery({ name: 'type', enum: report_type_enum, required: false })
  async findAll(@Query('type') type?: report_type_enum) {
    return this.service.findAll(type);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати звіт за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Створити новий звіт' })
  async create(@Body() data: CreateReportDto) {
    return this.service.create(data);
  }

  @Patch(':id')
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
