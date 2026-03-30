import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VolunteerProfileService } from './volunteer-profile.service';
import { CreateVolunteerProfileDto } from './dto/create-volunteer-profile.dto';
import { UpdateVolunteerProfileDto } from './dto/update-volunteer-profile.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Профілі волонтерів (Volunteer Profiles)')
@Controller('volunteer-profiles')
export class VolunteerProfileController {
  constructor(
    private readonly volunteerProfileService: VolunteerProfileService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати список профілів волонтерів' })
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
    name: 'isVerified',
    required: false,
    description: 'Фільтр за верифікацією (true/false)',
  })
  async getVolunteerProfiles(
    @Query('limit') limitStr?: string,
    @Query('skip') skipStr?: string,
    @Query('isVerified') isVerifiedStr?: string,
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

    let isVerified: boolean | undefined = undefined;
    if (isVerifiedStr === 'true') isVerified = true;
    if (isVerifiedStr === 'false') isVerified = false;

    return this.volunteerProfileService.getVolunteerProfiles(
      limit,
      skip,
      isVerified,
    );
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Отримати профіль волонтера за ID' })
  async getVolunteerProfileById(@Param('id', ParseIntPipe) id: number) {
    return this.volunteerProfileService.getVolunteerProfileById(id);
  }

  @Post()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Створити профіль волонтера' })
  async create(@Body() data: CreateVolunteerProfileDto) {
    return this.volunteerProfileService.createVolunteerProfile(data);
  }

  @Put(':id')
  @Roles(user_role_enum.ADMIN, user_role_enum.VOLUNTEER) //TODO ownership...
  @ApiOperation({ summary: 'Оновити профіль волонтера' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateVolunteerProfileDto,
  ) {
    return this.volunteerProfileService.updateVolunteerProfileFull(id, data);
  }

  @Patch(':id')
  @Roles(user_role_enum.ADMIN, user_role_enum.VOLUNTEER) //TODO ownership...
  @ApiOperation({ summary: 'Частково оновити профіль волонтера' })
  async updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateVolunteerProfileDto,
  ) {
    return this.volunteerProfileService.updateVolunteerProfilePartial(id, data);
  }

  @Delete(':id')
  @Roles(user_role_enum.ADMIN) //TODO ownership...Denis will have work,for now only admin will have permission to delete.in other files will write TODO own <3
  @ApiOperation({ summary: 'Видалити профіль волонтера' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.volunteerProfileService.deleteVolunteerProfile(id);
  }
}
