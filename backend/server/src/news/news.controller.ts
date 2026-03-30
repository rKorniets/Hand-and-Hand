import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import {user_role_enum} from "@prisma/client";
import {Roles} from "../auth/decorators/roles.decorator";

@ApiTags('Новини (News)')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати список новин' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Кількість новин на сторінці (за замовчуванням 5)',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Скільки новин пропустити з початку',
  })
  @ApiQuery({
    name: 'isPinned',
    required: false,
    description: 'Фільтр за закріпленими новинами (true/false)',
  })
  async getNews(
    @Query('limit') limitStr?: string,
    @Query('skip') skipStr?: string,
    @Query('isPinned') isPinnedStr?: string,
  ) {
    let limit = limitStr ? parseInt(limitStr, 10) : 5;
    if (isNaN(limit) || limit < 1) {
      limit = 5;
    }
    limit = Math.min(limit, 50);
    let skip = skipStr ? parseInt(skipStr, 10) : 0;
    if (isNaN(skip) || skip < 0) {
      skip = 0;
    }

    let isPinned: boolean | undefined = undefined;
    if (isPinnedStr === 'true') isPinned = true;
    if (isPinnedStr === 'false') isPinned = false;

    return this.newsService.getNews(limit, skip, isPinned);
  }
  @Post()
  @Roles(user_role_enum.ADMIN, user_role_enum.ORGANIZATION)
  async create(@Body() data: CreateNewsDto) {
    return this.newsService.createNews(data);
  }
  @Put(':id')
  @Roles(user_role_enum.ADMIN, user_role_enum.ORGANIZATION)
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateNewsDto,
  ) {
    return this.newsService.updateNewsFull(id, data);
  }

  @ApiOperation({ summary: 'Видалити новину' })
  @Roles(user_role_enum.ADMIN, user_role_enum.ORGANIZATION)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.deleteNews(id);
  }
}
//TODO ownership