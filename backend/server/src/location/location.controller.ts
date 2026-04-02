import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create_location.dto';
import { UpdateLocationDto } from './dto/update_location.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { user_role_enum } from '@prisma/client';

@ApiTags('Локації (Locations)')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Створити нову локацію (Тільки ADMIN)' })
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

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Оновити локацію (Тільки ADMIN)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateLocationDto,
  ) {
    return this.locationService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Видалити локацію (Тільки ADMIN)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.remove(id);
  }
}
