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
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FundraisingCampaignService } from './fundraising_campaign.service';
import { CreateFundraisingCampaignDto } from './dto/create-fundraising_campaign.dto';
import { fundraising_campaign_status_enum } from '@prisma/client';

@ApiTags('Fundraising Campaigns')
@Controller('fundraising_campaigns')
export class FundraisingCampaignController {
  constructor(private readonly service: FundraisingCampaignService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список зборів' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Кількість записів (за замовчуванням 5)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Фільтр за статусом',
  })
  async findAll(
    @Query('limit') limitStr?: string,
    @Query('status') status?: string,
  ) {
    const DEFAULT_LIMIT = 5;
    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;

    const parsedLimit = limitStr ? parseInt(limitStr, 10) : DEFAULT_LIMIT;
    const normalizedLimit = Number.isNaN(parsedLimit)
      ? DEFAULT_LIMIT
      : Math.min(Math.max(parsedLimit, MIN_LIMIT), MAX_LIMIT);

    let normalizedStatus: fundraising_campaign_status_enum | undefined;
    if (status !== undefined) {
      if (!(status in fundraising_campaign_status_enum)) {
        throw new BadRequestException('Invalid status value');
      }
      normalizedStatus =
        fundraising_campaign_status_enum[
          status as keyof typeof fundraising_campaign_status_enum
        ];
    }

    return this.service.findAll(normalizedLimit, normalizedStatus);
  }

  @Post()
  @ApiOperation({ summary: 'Створити збір' })
  async create(@Body() data: CreateFundraisingCampaignDto) {
    return this.service.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити збір' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateFundraisingCampaignDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити збір' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
