import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create_location.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { user_role_enum, location } from '@prisma/client';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Locations')
@Controller('locations')
export class LocationController extends AbstractCrudController<location[]> {
  constructor(private readonly locationService: LocationService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        locationService.findAll(limit, skip, search),
    } as unknown as IBaseCrudService<location[]>);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.ORGANIZATION)
  @ApiOperation({ summary: 'Створити нову локацію' })
  create(@Body() data: CreateLocationDto) {
    return this.locationService.create(data);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати список усіх локацій' })
  getLocations(@Query() query: PaginationDto) {
    return this.locationService.findAll(
      query.limit ?? 10,
      query.skip ?? 0,
      query.search,
    );
  }

  // Static "cities" route MUST be declared BEFORE ":id" route,
  // otherwise Express matches "cities" against ":id" and ParseIntPipe throws 400.
  @Public()
  @Get('cities')
  @ApiOperation({ summary: 'Отримати список міст' })
  getCities() {
    return this.locationService.getCities();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Отримати локацію за ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }
}
