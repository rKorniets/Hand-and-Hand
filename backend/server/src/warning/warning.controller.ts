import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { WarningService } from './warning.service';
import { Create_warningDto } from './dto/create_warning.dto';
import { Update_warningDto } from './dto/update_warning.dto';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { warning_status_enum, user_role_enum } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Warnings')
@Controller('warnings')
export class WarningController {
  constructor(private readonly service: WarningService) {}

  @Get()
  @ApiBearerAuth()
  @Roles(
    user_role_enum.ADMIN,
    user_role_enum.ORGANIZATION,
    user_role_enum.VOLUNTEER,
  )
  @ApiOperation({ summary: 'Отримати список попереджень' })
  @ApiQuery({ name: 'status', enum: warning_status_enum, required: false })
  async findAll(
    @CurrentUser() currentUser: { id: number; role: user_role_enum },
    @Query('status') status?: warning_status_enum,
  ) {
    return this.service.findAll(currentUser, status);
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(
    user_role_enum.ADMIN,
    user_role_enum.ORGANIZATION,
    user_role_enum.VOLUNTEER,
  )
  @ApiOperation({ summary: 'Отримати попередження за ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: { id: number; role: user_role_enum },
  ) {
    return this.service.findOne(id, currentUser);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Створити попередження' })
  async create(@Body() data: Create_warningDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Оновити попередження' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Update_warningDto,
  ) {
    return this.service.update(id, data);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Замінити попередження повністю' })
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Create_warningDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(user_role_enum.ADMIN)
  @ApiOperation({ summary: 'Видалити попередження' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
