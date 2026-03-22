import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
    const DEFAULT_LIMIT = 5;
    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;
    const DEFAULT_SKIP = 0;

    let limit = limitStr ? parseInt(limitStr, 10) : DEFAULT_LIMIT;
    if (isNaN(limit) || limit < MIN_LIMIT) limit = DEFAULT_LIMIT;
    limit = Math.min(limit, MAX_LIMIT);

    let skip = skipStr ? parseInt(skipStr, 10) : DEFAULT_SKIP;
    if (isNaN(skip) || skip < 0) skip = DEFAULT_SKIP;

    let verificationStatus: verification_status_enum | undefined;
    if (verificationStatusStr !== undefined) {
      if (
        !Object.values(verification_status_enum).includes(
          verificationStatusStr as verification_status_enum,
        )
      ) {
        throw new BadRequestException('Invalid verificationStatus value');
      }
      verificationStatus = verificationStatusStr as verification_status_enum;
    }

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
    return this.organizationProfileService.updateOrganizationProfileFull(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити профіль організації' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizationProfileService.deleteOrganizationProfile(id);
  }
}
