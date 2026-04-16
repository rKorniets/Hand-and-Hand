import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create_location.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

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
  findAll() {
    return this.locationService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Отримати локацію за ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }
}
