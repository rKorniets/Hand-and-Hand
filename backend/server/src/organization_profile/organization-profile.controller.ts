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
  organization_membership_request_status_enum,
  organization_profile,
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

@ApiTags('Organization Profiles')
@Controller('organization-profiles')
export class OrganizationProfileController extends AbstractCrudController<unknown> {
  constructor(
    private readonly organizationProfileService: OrganizationProfileService,
  ) {
    super(organizationProfileService as unknown as IBaseCrudService<unknown>);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати список організацій' })
  @ApiQuery({
    name: 'verification_status',
    required: false,
    enum: verification_status_enum,
    description: 'Статус верифікації',
  })
  @ApiQuery({
    name: 'categories',
    required: false,
    type: [String],
    description: 'Масив slugs категорій',
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
  @ApiOperation({ summary: 'Отримати профіль організації за ID' })
  async getOrganizationProfileById(@Param('id', ParseIntPipe) id: number) {
    return this.organizationProfileService.getOrganizationProfileById(id);
  }

  @Post()
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
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION, user_role_enum.ADMIN)
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

  @Post(':id/membership-requests')
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
  @ApiOperation({ summary: 'Отримати профіль організації за user_id' })
  async getByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.organizationProfileService.getOrganizationProfileByUserId(
      userId,
    );
  }
}
