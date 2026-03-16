import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(
    @Query('limit') limitStr?: string,
    @Query('isPinned') isPinnedStr?: string,
  ) {
    const limit = limitStr ? parseInt(limitStr, 10) : 5;
    let isPinned: boolean | undefined = undefined;
    if (isPinnedStr === 'true') isPinned = true;
    if (isPinnedStr === 'false') isPinned = false;

    return this.newsService.getNews(limit, isPinned);
  }
}
