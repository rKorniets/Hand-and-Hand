import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CampaignAdminService } from './campaign.admin.service';
import { CampaignQueryAdminDto } from './dto/campaign-query.admin.dto';
import { CreateFundraisingCampaignDto } from '../../fundraising_campaign/dto/create-fundraising_campaign.dto';
import { UpdateCampaignStatusAdminDto } from './dto/update-campaign-status.admin.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum, fundraising_campaign } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Адмін — Збори коштів')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/campaigns')
export class CampaignAdminController extends AbstractCrudController<
  fundraising_campaign[]
> {
  constructor(private readonly service: CampaignAdminService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll({ limit, skip, search } as CampaignQueryAdminDto),
    } as unknown as IBaseCrudService<fundraising_campaign[]>);
  }

  @Get()
  @ApiOperation({ summary: 'Всі збори коштів' })
  async getCampaigns(
    @Query() paginationQuery: PaginationDto,
    @Query() campaignQuery: CampaignQueryAdminDto,
  ) {
    return this.service.findAll({
      ...campaignQuery,
      limit: paginationQuery.limit ?? 10,
      skip: paginationQuery.skip ?? 0,
      search: paginationQuery.search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі збору коштів' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити збір коштів' })
  async create(@Body() data: CreateFundraisingCampaignDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити збір коштів' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateFundraisingCampaignDto,
  ) {
    return this.service.update(id, data);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Змінити статус збору' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCampaignStatusAdminDto,
  ) {
    return this.service.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити збір коштів' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
