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
import { user_role_enum, news } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../../common/dto/pagination.dto';
import type { AuthAdmin } from '../approval/approval.admin.controller';

@ApiTags('Адмін — Новини')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/news')
export class NewsAdminController extends AbstractCrudController<news[]> {
  constructor(private readonly service: NewsAdminService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll({ limit, skip, search } as NewsQueryAdminDto),
    } as unknown as IBaseCrudService<news[]>);
  }

  @Get()
  @ApiOperation({ summary: 'Всі новини (включаючи неопубліковані)' })
  async getNews(
    @Query() paginationQuery: PaginationDto,
    @Query() newsQuery: NewsQueryAdminDto,
  ) {
    return this.service.findAll({
      ...newsQuery,
      limit: paginationQuery.limit ?? 10,
      skip: paginationQuery.skip ?? 0,
      search: paginationQuery.search,
    });
  }

  @Get('pending')
  @ApiOperation({ summary: 'Новини на модерації' })
  async getPending() {
    return this.service.findPending();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі новини' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити новину' })
  async create(@Body() data: CreateNewsDto, @CurrentUser() user: AuthAdmin) {
    return this.service.create(data, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити новину' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateNewsDto,
  ) {
    return this.service.update(id, data);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Підтвердити новину' })
  async approve(@Param('id', ParseIntPipe) id: number) {
    return this.service.approve(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Відхилити новину' })
  async reject(@Param('id', ParseIntPipe) id: number) {
    return this.service.reject(id);
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
