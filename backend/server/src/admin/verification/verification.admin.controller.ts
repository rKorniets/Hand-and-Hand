import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { VerificationAdminService } from './verification.admin.service';
import { VerifyDecisionDto } from './dto/verify-decision.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum, verification_status_enum } from '@prisma/client';

@ApiTags('Адмін — Верифікація')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/verifications')
export class VerificationAdminController {
  constructor(private readonly service: VerificationAdminService) {}

  @Get('volunteers')
  @ApiOperation({ summary: 'Неверифіковані волонтери' })
  async findUnverifiedVolunteers() {
    return this.service.findUnverifiedVolunteers();
  }

  @Get('organizations')
  @ApiOperation({ summary: 'Неверифіковані організації' })
  async findUnverifiedOrganizations() {
    return this.service.findUnverifiedOrganizations();
  }

  @Patch('volunteers/:id')
  @ApiOperation({ summary: 'Верифікувати/відхилити волонтера' })
  async verifyVolunteer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VerifyDecisionDto,
  ) {
    return this.service.verifyVolunteer(id, dto.status === verification_status_enum.VERIFIED);
  }

  @Patch('organizations/:id')
  @ApiOperation({ summary: 'Верифікувати/відхилити організацію' })
  async verifyOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VerifyDecisionDto,
  ) {
    return this.service.verifyOrganization(id, dto.status);
  }
}
