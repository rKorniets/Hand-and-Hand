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
import { user_role_enum } from '@prisma/client';

@ApiTags('Адмін — Попередження')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/warnings')
export class WarningAdminController {
  constructor(private readonly service: WarningAdminService) {}

  @Get()
  @ApiOperation({ summary: 'Список усіх попереджень' })
  async findAll(@Query() query: WarningQueryAdminDto) {
    return this.service.findAll(query);
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
    @CurrentUser() user: { id: number },
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
