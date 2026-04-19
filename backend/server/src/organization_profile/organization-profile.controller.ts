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
  ParseEnumPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  user_role_enum,
  verification_status_enum,
  organization_profile,
} from '@prisma/client';
import {
  OrganizationProfileService,
  type RequestUser,
} from './organization-profile.service';
import { CreateOrganizationProfileDto } from './dto/create-organization-profile.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  AbstractCrudController,
  IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Organization Profiles')
@Controller('organization-profiles')
export class OrganizationProfileController extends AbstractCrudController<
  organization_profile[]
> {
  constructor(
    private readonly organizationProfileService: OrganizationProfileService,
  ) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        organizationProfileService.getOrganizationProfiles(
          limit,
          skip,
          verification_status_enum.VERIFIED,
          search,
        ),
    } as unknown as IBaseCrudService<organization_profile[]>);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати список профілів організацій' })
  @ApiQuery({
    name: 'verificationStatus',
    required: false,
    enum: verification_status_enum,
    description: 'Фільтр за статусом верифікації (PENDING, VERIFIED, REJECTED)',
  })
  async getOrganizationProfiles(
    @Query() query: PaginationDto,
    @Query(
      'verificationStatus',
      new ParseEnumPipe(verification_status_enum, { optional: true }),
    )
    verificationStatus?: verification_status_enum,
  ) {
    const status = verificationStatus ?? verification_status_enum.VERIFIED;
    return this.organizationProfileService.getOrganizationProfiles(
      query.limit ?? 5,
      query.skip ?? 0,
      status,
      query.search,
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
    @CurrentUser() currentUser: RequestUser,
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
    @CurrentUser() currentUser: RequestUser,
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
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.organizationProfileService.deleteOrganizationProfile(
      id,
      currentUser,
    );
  }

  @Public()
  @Get(':id/projects')
  @ApiOperation({ summary: 'Отримати проекти організації' })
  async getProjects(@Param('id', ParseIntPipe) id: number) {
    return this.organizationProfileService.getOrganizationProjects(id);
  }

  @Public()
  @Get(':id/reports')
  @ApiOperation({ summary: 'Отримати звіти організації' })
  async getReports(@Param('id', ParseIntPipe) id: number) {
    return this.organizationProfileService.getOrganizationReports(id);
  }

  @Public()
  @Get(':id/members')
  @ApiOperation({ summary: 'Отримати учасників організації' })
  async getMembers(@Param('id', ParseIntPipe) id: number) {
    return this.organizationProfileService.getOrganizationMembers(id);
  }

  @Public()
  @Get(':id/fundraising')
  @ApiOperation({ summary: 'Отримати збори організації' })
  async getFundraising(@Param('id', ParseIntPipe) id: number) {
    return this.organizationProfileService.getOrganizationFundraising(id);
  }

  @Public()
  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Отримати профіль організації за user_id' })
  async getByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.organizationProfileService.getOrganizationProfileByUserId(
      userId,
    );
  }
}
