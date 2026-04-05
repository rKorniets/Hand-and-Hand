import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Створити категорію (Тільки Admin)' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Отримати список всіх категорій' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати категорію за ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Оновити категорію (Тільки Admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Видалити категорію (Тільки Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
