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
  ParseBoolPipe,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { VolunteerProfileService } from './volunteer-profile.service';
import { CreateVolunteerProfileDto } from './dto/create-volunteer-profile.dto';
import { UpdateVolunteerProfileDto } from './dto/update-volunteer-profile.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { user_role_enum, volunteer_profile } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Volunteer Profiles')
@ApiBearerAuth()
@Controller('volunteer-profiles')
export class VolunteerProfileController extends AbstractCrudController<
  volunteer_profile[]
> {
  constructor(
    private readonly volunteerProfileService: VolunteerProfileService,
  ) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        volunteerProfileService.getVolunteerProfiles(
          limit,
          skip,
          undefined,
          search,
        ),
    } as unknown as IBaseCrudService<volunteer_profile[]>);
  }

  @Public()
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Отримати список профілів волонтерів' })
  @ApiQuery({
    name: 'isVerified',
    required: false,
    type: Boolean,
    description: 'Фільтр за верифікацією (true/false)',
  })
  async getVolunteerProfiles(
    @Query() query: PaginationDto,
    @Query('isVerified', new ParseBoolPipe({ optional: true }))
    isVerified?: boolean,
  ) {
    return this.volunteerProfileService.getVolunteerProfiles(
      query.limit ?? 5,
      query.skip ?? 0,
      isVerified,
      query.search,
    );
  }

  @Public()
  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Throttle({ default: { limit: 200, ttl: 60000 } })
  @ApiOperation({ summary: 'Отримати профіль волонтера за ID' })
  async getVolunteerProfileById(@Param('id', ParseIntPipe) id: number) {
    return this.volunteerProfileService.getVolunteerProfileById(id);
  }

  @Post('verification-request')
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Подати заявку на верифікацію волонтера' })
  async requestVerification(@CurrentUser() user: { id: number }) {
    return this.volunteerProfileService.createVerificationRequest(user);
  }

  @Put(':id')
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Оновити профіль волонтера' })
  async updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateVolunteerProfileDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.volunteerProfileService.updateVolunteerProfileFull(
      id,
      data,
      user,
    );
  }

  @Patch(':id')
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Частково оновити профіль волонтера' })
  async updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateVolunteerProfileDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.volunteerProfileService.updateVolunteerProfilePartial(
      id,
      data,
      user,
    );
  }

  @Delete(':id')
  @Roles(user_role_enum.VOLUNTEER)
  @ApiOperation({ summary: 'Видалити профіль волонтера' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.volunteerProfileService.deleteVolunteerProfile(id, user);
  }
}
