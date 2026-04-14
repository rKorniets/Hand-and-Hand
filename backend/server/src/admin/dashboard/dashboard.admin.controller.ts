import { Controller, Get } from '@nestjs/common';
import { DashboardAdminService } from './dashboard.admin.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Адмін — Дашборд')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/dashboard')
export class DashboardAdminController {
  constructor(private readonly service: DashboardAdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Загальна статистика системи' })
  async getStats() {
    return this.service.getStats();
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Остання активність в системі' })
  async getRecentActivity() {
    return this.service.getRecentActivity();
  }
}
