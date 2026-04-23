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
import { CreateCampaignAdminDto } from './dto/create-campaign.admin.dto';
import { UpdateCampaignStatusAdminDto } from './dto/update-campaign-status.admin.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Адмін — Збори коштів')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/campaigns')
export class CampaignAdminController {
  constructor(private readonly service: CampaignAdminService) {}

  @Get()
  @ApiOperation({ summary: 'Всі збори коштів' })
  async findAll(@Query() query: CampaignQueryAdminDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі збору коштів' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити збір коштів' })
  async create(@Body() data: CreateCampaignAdminDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити збір коштів' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateCampaignAdminDto,
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
