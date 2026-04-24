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
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
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

@ApiTags('Fundraising Campaigns')
@Controller('fundraising_campaigns')
export class FundraisingCampaignController extends AbstractCrudController<unknown> {
  constructor(private readonly service: FundraisingCampaignService) {
    super(service as unknown as IBaseCrudService<unknown>);
  }

  @Get()
  @Public()
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
    @Query('categories') categories?: string[],
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
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(
    user_role_enum.ORGANIZATION,
    user_role_enum.VOLUNTEER,
    user_role_enum.ADMIN,
  )
  @ApiOperation({ summary: 'Створити збір' })
  async create(
    @Body() data: CreateFundraisingCampaignDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.create(data, user);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Оновити збір' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateFundraisingCampaignDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.update(id, data, { id: user.id });
  }

  @Delete(':id')
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
  @Public()
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
}
