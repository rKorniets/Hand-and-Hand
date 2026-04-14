import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { user_role_enum, verification_status_enum } from '@prisma/client';
import * as organizationProfileService_1 from './organization-profile.service';
import { CreateOrganizationProfileDto } from './dto/create-organization-profile.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Organization Profiles')
@Controller('organization-profiles')
export class OrganizationProfileController {
  constructor(
    private readonly organizationProfileService: organizationProfileService_1.OrganizationProfileService,
  ) {}

  @Public()
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
  @ApiQuery({ name: 'search', required: false })
  async getOrganizationProfiles(
    @Query('limit') limitStr?: string,
    @Query('skip') skipStr?: string,
    @Query('verificationStatus') verificationStatusStr?: string,
    @Query('search') search?: string,
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
      search,
    );
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Отримати профіль організації за ID' })
  async getOrganizationProfileById(@Param('id', ParseIntPipe) id: number) {
    return this.organizationProfileService.getOrganizationProfileById(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Створити профіль організації' })
  async create(
    @Body() data: CreateOrganizationProfileDto,
    @CurrentUser() currentUser: organizationProfileService_1.RequestUser,
  ) {
    return this.organizationProfileService.createOrganizationProfile(
      data,
      currentUser,
    );
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Оновити профіль організації' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateOrganizationProfileDto,
    @CurrentUser() currentUser: organizationProfileService_1.RequestUser,
  ) {
    return this.organizationProfileService.updateOrganizationProfileFull(
      id,
      data,
      currentUser,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Видалити профіль організації' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: organizationProfileService_1.RequestUser,
  ) {
    return this.organizationProfileService.deleteOrganizationProfile(
      id,
      currentUser,
    );
  }
}
