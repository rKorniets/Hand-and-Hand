import { Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationDto } from '../dto/pagination.dto';
import { Public } from '../../auth/decorators/public.decorator';

export interface IBaseCrudService<T> {
  findAll(limit?: number, skip?: number, search?: string): Promise<T>;
}

export abstract class AbstractCrudController<T> {
  protected constructor(protected readonly baseService: IBaseCrudService<T>) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Отримати список записів' })
  async findAll(@Query() query: PaginationDto): Promise<T> {
    return await this.baseService.findAll(
      query.limit,
      query.skip,
      query.search,
    );
  }
}
