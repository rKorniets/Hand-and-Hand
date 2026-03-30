import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { WarningService } from './warning.service';
import { Create_warningDto } from './dto/create_warning.dto';
import { Update_warningDto } from './dto/update_warning.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { warning_status_enum } from '@prisma/client';

@ApiTags('Warnings')
@Controller('warnings')
export class WarningController {
  constructor(private readonly service: WarningService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список попереджень' })
  @ApiQuery({ name: 'status', enum: warning_status_enum, required: false })
  async findAll(@Query('status') status?: warning_status_enum) {
    return this.service.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати попередження за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити попередження' })
  async create(@Body() data: Create_warningDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити попередження' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Update_warningDto,
  ) {
    return this.service.update(id, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Замінити попередження повністю' })
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Create_warningDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити попередження' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
