import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApprovalAdminService } from './approval.admin.service';
import { ApprovalQueryDto } from './dto/approval-query.dto';
import { RejectApprovalDto } from './dto/reject-approval.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Адмін — Заявки на підтвердження')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/approvals')
export class ApprovalAdminController {
  constructor(private readonly service: ApprovalAdminService) {}

  @Get()
  @ApiOperation({ summary: 'Список заявок на підтвердження' })
  async findAll(@Query() query: ApprovalQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі заявки' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Підтвердити заявку' })
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.approve(id, user.id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Відхилити заявку' })
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectApprovalDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.service.reject(id, user.id, dto.reason);
  }
}
