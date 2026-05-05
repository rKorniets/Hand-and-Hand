import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  ParseEnumPipe,
  ParseArrayPipe,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { FundraisingCampaignService } from './fundraising_campaign.service';
import { CreateFundraisingCampaignDto } from './dto/create-fundraising_campaign.dto';
import { CreateDonationDto } from './dto/create-donation.dto';
import {
  fundraising_campaign_status_enum,
  user_role_enum,
} from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  AbstractCrudController,
  IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateFundraisingCampaignDto } from './dto/update-fundraising_campaign.dto';

@ApiTags('Fundraising Campaigns')
@Controller('fundraising_campaigns')
@SkipThrottle()
export class FundraisingCampaignController extends AbstractCrudController<unknown> {
  constructor(private readonly service: FundraisingCampaignService) {
    super(service as unknown as IBaseCrudService<unknown>);
  }

  @Get()
  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Отримати список зборів' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: fundraising_campaign_status_enum,
    description: 'Фільтр за статусом',
    isArray: true,
  })
  @ApiQuery({
    name: 'categories',
    required: false,
    type: [String],
    description: 'Масив slugs категорій',
  })
  async findAll(
    @Query() query: PaginationDto,
    @Query(
      'status',
      new ParseEnumPipe(fundraising_campaign_status_enum, { optional: true }),
    )
    status?: fundraising_campaign_status_enum,
    @Query(
      'categories',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    categories?: string[],
  ) {
    return this.service.findAll(
      query.limit ?? 8,
      query.skip ?? 0,
      status,
      query.search,
      categories,
    );
  }

  @Get(':id')
  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Отримати деталі конкретного збору' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Створити збір' })
  async create(
    @Body() data: CreateFundraisingCampaignDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.create(data, user);
  }

  @Put(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Оновити збір' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateFundraisingCampaignDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.update(id, data, { id: user.id });
  }

  @Delete(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Видалити збір' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.remove(id, { id: user.id });
  }

  @Post(':id/donations')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Зробити донат на конкретний збір' })
  async donate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateDonationDto,
  ) {
    return this.service.processDonation(
      id,
      dto.amount,
      dto.donor_name,
      dto.message,
    );
  }

  @Patch(':id/image')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Завантажити/замінити зображення збору' })
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
    return this.service.updateImage(id, file, { id: user.id });
  }
}
