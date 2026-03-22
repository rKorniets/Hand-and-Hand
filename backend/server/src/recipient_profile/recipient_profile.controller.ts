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
import { RecipientProfileService } from './recipient_profile.service';
import { CreateRecipientProfileDto } from './dto/create_recipient_profile.dto';
import { UpdateRecipientProfileDto } from './dto/update_recipient_profile.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Recipient Profiles')
@Controller('recipient_profiles')
export class RecipientProfileController {
  constructor(private readonly service: RecipientProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список усіх реципієнтів' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати профіль за ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Створити профіль реципієнта' })
  async create(@Body() data: CreateRecipientProfileDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити профіль реципієнта' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRecipientProfileDto,
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити профіль реципієнта' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
