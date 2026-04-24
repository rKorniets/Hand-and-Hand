import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Public } from '../auth/decorators/public.decorator';
import {
  AbstractCrudController,
  IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';
import { category } from '@prisma/client';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController extends AbstractCrudController<category[]> {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService as unknown as IBaseCrudService<category[]>);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Отримати список всіх категорій' })
  findAll(@Query() query: PaginationDto) {
    return this.categoryService.findAll(
      query.limit ?? 5,
      query.skip ?? 0,
      query.search,
      query.for,
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати категорію за ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }
}
