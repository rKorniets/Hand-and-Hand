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
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { verification_status_enum } from '@prisma/client';
import { OrganizationProfileService } from './organization-profile.service';
import { CreateOrganizationProfileDto } from './dto/create-organization-profile.dto';

@ApiTags('Профілі організацій (Organization Profiles)')
@Controller('organization-profiles')
export class OrganizationProfileController {
  constructor(
    private readonly organizationProfileService: OrganizationProfileService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список профілів організацій' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Кількість записів на сторінці (за замовчуванням 5)',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Скільки записів пропустити',
  })
  @ApiQuery({
    name: 'verificationStatus',
    required: false,
    description: 'Фільтр за статусом верифікації (PENDING, VERIFIED, REJECTED)',
  })
  async getOrganizationProfiles(
    @Query('limit') limitStr?: string,
    @Query('skip') skipStr?: string,
    @Query('verificationStatus') verificationStatusStr?: string,
  ) {
    let limit = limitStr ? parseInt(limitStr, 10) : 5;
    if (isNaN(limit) || limit < 1) limit = 5;
    limit = Math.min(limit, 50);

    let skip = skipStr ? parseInt(skipStr, 10) : 0;
    if (isNaN(skip) || skip < 0) skip = 0;

    const verificationStatus = Object.values(verification_status_enum).includes(
      verificationStatusStr as verification_status_enum,
    )
      ? (verificationStatusStr as verification_status_enum)
      : undefined;

    return this.organizationProfileService.getOrganizationProfiles(
      limit,
      skip,
      verificationStatus,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати профіль організації за ID' })
  async getOrganizationProfileById(@Param('id', ParseIntPipe) id: number) {
    return this.organizationProfileService.getOrganizationProfileById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити профіль організації' })
  async create(@Body() data: CreateOrganizationProfileDto) {
    return this.organizationProfileService.createOrganizationProfile(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити профіль організації' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateOrganizationProfileDto,
  ) {
    return this.organizationProfileService.updateOrganizationProfileFull(
      id,
      data,
    );
  }
}
