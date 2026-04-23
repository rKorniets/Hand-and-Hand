import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { user_role_enum, location } from '@prisma/client';
import { LocationService } from '../../location/location.service';
import { CreateLocationDto } from '../../location/dto/create_location.dto';
import { UpdateLocationDto } from '../../location/dto/update_location.dto';
import {
  AbstractCrudController,
  type IBaseCrudService,
} from '../../common/controllers/abstract-crud.controller';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Адмін — Локації')
@ApiBearerAuth()
@Roles(user_role_enum.ADMIN)
@Controller('admin/locations')
export class LocationAdminController extends AbstractCrudController<
  location[]
> {
  constructor(private readonly service: LocationService) {
    super({
      findAll: (limit?: number, skip?: number, search?: string) =>
        service.findAll(limit, skip, search),
    } as unknown as IBaseCrudService<location[]>);
  }

  @Get()
  @ApiOperation({ summary: 'Список усіх локацій' })
  getLocations(@Query() query: PaginationDto) {
    return this.service.findAll(
      query.limit ?? 10,
      query.skip ?? 0,
      query.search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Деталі локації' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити локацію' })
  create(@Body() data: CreateLocationDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити локацію' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateLocationDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити локацію' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
