import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
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
  @Post()
  async create(@Body() data: CreateNewsDto) {
    return this.newsService.createNews(data);
  }
  @Put(':id')
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateNewsDto,
  ) {
    return this.newsService.updateNewsFull(id, data);
  }
}
