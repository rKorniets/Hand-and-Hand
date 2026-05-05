import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  ParseEnumPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  user_role_enum,
  verification_status_enum,
  organization_membership_request_status_enum,
} from '@prisma/client';
import {
  OrganizationProfileService,
  type RequestUser,
} from './organization-profile.service';
import { CreateOrganizationProfileDto } from './dto/create-organization-profile.dto';
import { InviteVolunteerDto } from './dto/invite-volunteer.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  AbstractCrudController,
  IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { UpdateOrganizationProfileDto } from './dto/update-organization-profile.dto';

@ApiTags('Organization Profiles')
@Controller('organization-profiles')
@SkipThrottle()
export class OrganizationProfileController extends AbstractCrudController<unknown> {
  constructor(
    private readonly organizationProfileService: OrganizationProfileService,
  ) {
    super(organizationProfileService as unknown as IBaseCrudService<unknown>);
  }

  @Public()
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Отримати список організацій' })
  @ApiQuery({
    name: 'verification_status',
    required: false,
    enum: verification_status_enum,
    description: 'Filter organizations by verification status',
  })
  @ApiQuery({
    name: 'categories',
    required: false,
    type: [String],
    description: 'Filter organizations by one or more categories',
  })
  async getOrganizationProfiles(
    @Query() query: PaginationDto,
    @Query(
      'verification_status',
      new ParseEnumPipe(verification_status_enum, { optional: true }),
    )
    status?: verification_status_enum,
    @Query('categories') categories?: string[],
  ) {
    return this.organizationProfileService.getOrganizationProfiles(
      query.limit ?? 5,
      query.skip ?? 0,
      status,
      query.search,
      categories,
    );
  }

  @Public()
  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Отримати профіль організації за ID' })
  async getOrganizationProfileById(@Param('id', ParseIntPipe) id: number) {
    return this.organizationProfileService.getOrganizationProfileById(id);
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.ADMIN)
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
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Оновити профіль організації (повністю)' })
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

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Оновити профіль організації (частково)' })
  async updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateOrganizationProfileDto,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.organizationProfileService.updateOrganizationProfilePartial(
      id,
      data,
      currentUser,
    );
  }

  @Delete(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.ADMIN)
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
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Отримати проекти організації' })
  async getProjects(@Param('id', ParseIntPipe) id: number) {
    return this.organizationProfileService.getOrganizationProjects(id);
  }

  @Public()
  @Get(':id/reports')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Отримати звіти організації' })
  async getReports(@Param('id', ParseIntPipe) id: number) {
    return this.organizationProfileService.getOrganizationReports(id);
  }

  @Public()
  @Get(':id/members')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Отримати учасників організації' })
  async getMembers(@Param('id', ParseIntPipe) id: number) {
    return this.organizationProfileService.getOrganizationMembers(id);
  }

  @Public()
  @Get(':id/fundraising')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Отримати збори організації' })
  async getFundraising(@Param('id', ParseIntPipe) id: number) {
    return this.organizationProfileService.getOrganizationFundraising(id);
  }

  @Post(':id/membership-requests')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Подати заявку на вступ до організації' })
  async requestMembership(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.organizationProfileService.createMembershipRequest(
      id,
      currentUser,
    );
  }

  @Get(':id/membership-requests')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Список заявок на вступ до організації' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: organization_membership_request_status_enum,
  })
  async listMembershipRequests(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: RequestUser,
    @Query(
      'status',
      new ParseEnumPipe(organization_membership_request_status_enum, {
        optional: true,
      }),
    )
    status?: organization_membership_request_status_enum,
  ) {
    return this.organizationProfileService.listMembershipRequests(
      id,
      currentUser,
      status,
    );
  }

  @Patch(':id/membership-requests/:requestId/accept')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Прийняти заявку на вступ' })
  async acceptMembershipRequest(
    @Param('id', ParseIntPipe) id: number,
    @Param('requestId', ParseIntPipe) requestId: number,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.organizationProfileService.acceptMembershipRequest(
      id,
      requestId,
      currentUser,
    );
  }

  @Patch(':id/membership-requests/:requestId/reject')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Відхилити заявку на вступ' })
  async rejectMembershipRequest(
    @Param('id', ParseIntPipe) id: number,
    @Param('requestId', ParseIntPipe) requestId: number,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.organizationProfileService.rejectMembershipRequest(
      id,
      requestId,
      currentUser,
    );
  }

  @Post(':id/invitations')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Запросити волонтера в організацію' })
  async inviteVolunteer(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: InviteVolunteerDto,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.organizationProfileService.inviteVolunteer(
      id,
      data.user_id,
      currentUser,
    );
  }

  @Get('me/invitations')
  @ApiBearerAuth()
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Мої запрошення в організації' })
  async listMyInvitations(@CurrentUser() currentUser: RequestUser) {
    return this.organizationProfileService.listMyInvitations(currentUser);
  }

  @Patch('me/invitations/:invitationId/accept')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Прийняти запрошення' })
  async acceptInvitation(
    @Param('invitationId', ParseIntPipe) invitationId: number,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.organizationProfileService.acceptInvitation(
      invitationId,
      currentUser,
    );
  }

  @Patch('me/invitations/:invitationId/reject')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Відхилити запрошення' })
  async rejectInvitation(
    @Param('invitationId', ParseIntPipe) invitationId: number,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.organizationProfileService.rejectInvitation(
      invitationId,
      currentUser,
    );
  }

  @Get(':id/invitations')
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Список надісланих запрошень' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: organization_membership_request_status_enum,
  })
  async listInvitations(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: RequestUser,
    @Query(
      'status',
      new ParseEnumPipe(organization_membership_request_status_enum, {
        optional: true,
      }),
    )
    status?: organization_membership_request_status_enum,
  ) {
    return this.organizationProfileService.listOrganizationInvitations(
      id,
      currentUser,
      status,
    );
  }

  @Delete(':id/members/me')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Вийти з організації' })
  async leaveOrganization(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.organizationProfileService.leaveOrganization(id, currentUser);
  }

  @Delete(':id/members/:userId')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Видалити учасника з організації' })
  async removeMember(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.organizationProfileService.removeMember(
      id,
      userId,
      currentUser,
    );
  }

  @Public()
  @Get('by-user/:userId')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Отримати профіль організації за user_id' })
  async getByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.organizationProfileService.getOrganizationProfileByUserId(
      userId,
    );
  }

  @Patch(':id/logo')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Завантажити/замінити логотип організації' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: RequestUser,
  ) {
    return this.organizationProfileService.updateLogo(id, file, currentUser);
  }
}
