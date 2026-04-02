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
import { Roles } from '../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Новини (News)')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Get()
  @Public()
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
  @ApiQuery({ name: 'search', required: false })
  async getNews(
    @Query('limit') limitStr?: string,
    @Query('skip') skipStr?: string,
    @Query('isPinned') isPinnedStr?: string,
    @Query('search') search?: string,
  ) {
    const DEFAULT_LIMIT = 5;
    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;

    const parsedLimit = limitStr ? parseInt(limitStr, 10) : DEFAULT_LIMIT;
    const normalizedLimit = Number.isNaN(parsedLimit)
      ? DEFAULT_LIMIT
      : Math.min(Math.max(parsedLimit, MIN_LIMIT), MAX_LIMIT);

    const DEFAULT_SKIP = 0;
    const MIN_SKIP = 0;

    const parsedSkip = skipStr ? parseInt(skipStr, 10) : DEFAULT_SKIP;
    const normalizedSkip = Number.isNaN(parsedSkip)
      ? DEFAULT_SKIP
      : Math.max(parsedSkip, MIN_SKIP);

    let isPinned: boolean | undefined = undefined;
    if (isPinnedStr === 'true') isPinned = true;
    if (isPinnedStr === 'false') isPinned = false;

    return this.newsService.getNews(
      normalizedLimit,
      normalizedSkip,
      isPinned,
      search,
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати новину за ID' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.getNewsById(id);
  }

  @Post()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Створити новину' })
  async create(@Body() data: CreateNewsDto) {
    return this.newsService.createNews(data);
  }
  @Put(':id')
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Оновити новину' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateNewsDto,
  ) {
    return this.newsService.updateNewsFull(id, data);
  }

  @Delete(':id')
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Видалити новину' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.deleteNews(id);
  }
}
//TODO OWNERSHIP YEPPI
