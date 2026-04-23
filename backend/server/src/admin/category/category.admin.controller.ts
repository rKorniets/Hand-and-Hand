import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryAdminService } from './category.admin.service';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';
import { UpdateCategoryDto } from '../../category/dto/update-category.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum, category } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Адмін — Категорії')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/categories')
export class CategoryAdminController extends AbstractCrudController<
  category[]
> {
  constructor(private readonly service: CategoryAdminService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll(limit, skip, search),
    } as unknown as IBaseCrudService<category[]>);
  }

  @Get()
  @ApiOperation({ summary: 'Список всіх категорій' })
  async getCategories(@Query() query: PaginationDto) {
    return this.service.findAll(
      query.limit ?? 10,
      query.skip ?? 0,
      query.search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі категорії' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити категорію' })
  async create(@Body() data: CreateCategoryDto) {
    return this.service.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити категорію' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити категорію' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
