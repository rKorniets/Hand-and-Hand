import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryAdminService } from './category.admin.service';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';
import { UpdateCategoryDto } from '../../category/dto/update-category.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Адмін — Категорії')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/categories')
export class CategoryAdminController {
  constructor(private readonly service: CategoryAdminService) {}

  @Get()
  @ApiOperation({ summary: 'Список всіх категорій' })
  async findAll() {
    return this.service.findAll();
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
