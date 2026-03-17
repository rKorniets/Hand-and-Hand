import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';
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
    const limit = limitStr ? parseInt(limitStr, 10) : 5;
    const skip = skipStr ? parseInt(skipStr, 10) : 0;

    let isPinned: boolean | undefined = undefined;
    if (isPinnedStr === 'true') isPinned = true;
    if (isPinnedStr === 'false') isPinned = false;

    return this.newsService.getNews(limit, skip, isPinned);
  }
}
