import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { user_role_enum } from '@prisma/client';
import {
  AbstractCrudController,
  IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('News')
@Controller('news')
export class NewsController extends AbstractCrudController<unknown> {
  constructor(private readonly newsService: NewsService) {
    super(newsService as unknown as IBaseCrudService<unknown>);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Отримати список новин' })
  @ApiQuery({
    name: 'isPinned',
    required: false,
    description: 'Фільтр за закріпленими новинами',
    type: Boolean,
  })
  async findAll(
    @Query() query: PaginationDto,
    @Query('isPinned', new ParseBoolPipe({ optional: true }))
    isPinned?: boolean,
  ) {
    return this.newsService.getNews(
      query.limit ?? 5,
      query.skip ?? 0,
      isPinned,
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати новину за ID' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.getNewsById(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Створити новину' })
  async create(
    @Body() data: CreateNewsDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.newsService.createNews(data, user.id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Оновити новину (тільки автор)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateNewsDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.newsService.updateNewsFull(id, data, { id: user.id });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Видалити новину (тільки автор)' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.newsService.deleteNews(id, { id: user.id });
  }
}
