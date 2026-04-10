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

@ApiTags('Fundraising Campaigns')
@Controller('fundraising_campaigns')
export class FundraisingCampaignController {
  constructor(private readonly service: FundraisingCampaignService) {}

  @Public()
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
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('limit') limitStr?: string,
    @Query('skip') skipStr?: string,
    @Query('status') status?: string,
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
    const parsedSkip = skipStr ? parseInt(skipStr, 10) : DEFAULT_SKIP;
    const normalizedSkip = Number.isNaN(parsedSkip)
      ? DEFAULT_SKIP
      : Math.max(parsedSkip, DEFAULT_SKIP);
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

    return this.service.findAll(
      normalizedLimit,
      normalizedSkip,
      normalizedStatus,
      search,
    );
  }

  @Post()
  @ApiBearerAuth()
  @Roles(
    user_role_enum.ORGANIZATION,
    user_role_enum.VOLUNTEER,
    user_role_enum.ADMIN,
  )
  @ApiOperation({ summary: 'Створити збір' })
  //TODO: визначити profile_id автоматично з currentUser замість DTO
  async create(@Body() data: CreateFundraisingCampaignDto) {
    return this.service.create(data);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Оновити збір' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateFundraisingCampaignDto,
    @CurrentUser() user: { sub: number },
  ) {
    return this.service.update(id, data, { id: user.sub });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Видалити збір' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { sub: number },
  ) {
    return this.service.remove(id, { id: user.sub });
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
