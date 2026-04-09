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
import { NewsAdminService } from './news.admin.service';
import { NewsQueryAdminDto } from './dto/news-query.admin.dto';
import { CreateNewsDto } from '../../news/dto/create-news.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Адмін — Новини')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/news')
export class NewsAdminController {
  constructor(private readonly service: NewsAdminService) {}

  @Get()
  @ApiOperation({ summary: 'Всі новини (включаючи неопубліковані)' })
  async findAll(@Query() query: NewsQueryAdminDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі новини' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити новину' })
  async create(
    @Body() data: CreateNewsDto,
    @CurrentUser() user: { sub: number },
  ) {
    return this.service.create(data, user.sub);
  }

  //TODO: ownership — новину може редагувати або видаляти не тільки адмін, але й той хто її створив (created_by)
  @Patch(':id')
  @ApiOperation({ summary: 'Оновити новину' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateNewsDto,
  ) {
    return this.service.update(id, data);
  }

  @Patch(':id/pin')
  @ApiOperation({ summary: 'Закріпити/відкріпити новину' })
  async togglePin(@Param('id', ParseIntPipe) id: number) {
    return this.service.togglePin(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити новину' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
