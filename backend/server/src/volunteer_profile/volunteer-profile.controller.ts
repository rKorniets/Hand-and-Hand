import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VolunteerProfileService } from './volunteer-profile.service';
import { CreateVolunteerProfileDto } from './dto/create-volunteer-profile.dto';

@ApiTags('Профілі волонтерів (Volunteer Profiles)')
@Controller('volunteer-profiles')
export class VolunteerProfileController {
  constructor(
    private readonly volunteerProfileService: VolunteerProfileService,
  ) {}

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
    let limit = limitStr ? parseInt(limitStr, 10) : 5;
    if (isNaN(limit) || limit < 1) limit = 5;
    limit = Math.min(limit, 50);

    let skip = skipStr ? parseInt(skipStr, 10) : 0;
    if (isNaN(skip) || skip < 0) skip = 0;

    let isVerified: boolean | undefined = undefined;
    if (isVerifiedStr === 'true') isVerified = true;
    if (isVerifiedStr === 'false') isVerified = false;

    return this.volunteerProfileService.getVolunteerProfiles(
      limit,
      skip,
      isVerified,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати профіль волонтера за ID' })
  async getVolunteerProfileById(@Param('id', ParseIntPipe) id: number) {
    return this.volunteerProfileService.getVolunteerProfileById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити профіль волонтера' })
  async create(@Body() data: CreateVolunteerProfileDto) {
    return this.volunteerProfileService.createVolunteerProfile(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити профіль волонтера' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateVolunteerProfileDto,
  ) {
    return this.volunteerProfileService.updateVolunteerProfileFull(id, data);
  }
}
