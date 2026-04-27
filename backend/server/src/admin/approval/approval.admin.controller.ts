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
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../../common/dto/pagination.dto';

export interface AuthAdmin {
  id: number;
  role: user_role_enum;
}

@ApiTags('Адмін — Заявки на підтвердження')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/approvals')
export class ApprovalAdminController extends AbstractCrudController<any> {
  constructor(private readonly service: ApprovalAdminService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll({ limit, skip, search } as unknown as ApprovalQueryDto &
          PaginationDto),
    } as unknown as IBaseCrudService<any>);
  }

  @Get()
  @ApiOperation({ summary: 'Список заявок на підтвердження' })
  async getApprovals(
    @Query() paginationQuery: PaginationDto,
    @Query() approvalQuery: ApprovalQueryDto,
  ) {
    return this.service.findAll({
      ...approvalQuery,
      limit: paginationQuery.limit ?? 10,
      skip: paginationQuery.skip ?? 0,
      search: paginationQuery.search,
    });
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
    @CurrentUser() user: AuthAdmin,
  ) {
    return this.service.approve(id, user.id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Відхилити заявку' })
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectApprovalDto,
    @CurrentUser() user: AuthAdmin,
  ) {
    return this.service.reject(id, user.id, dto.reason);
  }
}
