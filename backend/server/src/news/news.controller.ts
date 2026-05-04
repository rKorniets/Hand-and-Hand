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
  UseInterceptors,
  Patch,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
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
import { GetNewsDto } from './dto/get-news.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('News')
@Controller('news')
@SkipThrottle()
export class NewsController extends AbstractCrudController<unknown> {
  constructor(private readonly newsService: NewsService) {
    super(newsService as unknown as IBaseCrudService<unknown>);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Отримати список новин' })
  async findAll(@Query() query: GetNewsDto) {
    return this.newsService.getNews(
      query.limit ?? 5,
      query.skip ?? 0,
      query.isPinned,
      query.search,
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Отримати новину за ID' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.getNewsById(id);
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
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
  @Throttle({ default: { limit: 10, ttl: 60000 } })
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
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Видалити новину (тільки автор)' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.newsService.deleteNews(id, { id: user.id });
  }
  @Patch(':id/image')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Завантажити/замінити зображення новини' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { id: number },
  ) {
    return this.newsService.updateImage(id, file, { id: user.id });
  }
}
