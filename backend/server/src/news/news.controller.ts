import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Новини (News)')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

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
    const DEFAULT_LIMIT = 5;
    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;
    const DEFAULT_SKIP = 0;

    let limit = limitStr ? parseInt(limitStr, 10) : DEFAULT_LIMIT;
    if (isNaN(limit) || limit < MIN_LIMIT) limit = DEFAULT_LIMIT;
    limit = Math.min(limit, MAX_LIMIT);

    let skip = skipStr ? parseInt(skipStr, 10) : DEFAULT_SKIP;
    if (isNaN(skip) || skip < 0) skip = DEFAULT_SKIP;

    let isPinned: boolean | undefined = undefined;
    if (isPinnedStr === 'true') isPinned = true;
    if (isPinnedStr === 'false') isPinned = false;

    return this.newsService.getNews(limit, skip, isPinned);
  }

  @Post()
  @ApiOperation({ summary: 'Створити новину' })
  async create(@Body() data: CreateNewsDto) {
    return this.newsService.createNews(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити новину' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateNewsDto,
  ) {
    return this.newsService.updateNewsFull(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити новину' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.deleteNews(id);
  }
}
