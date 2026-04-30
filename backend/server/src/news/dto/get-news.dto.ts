import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class GetNewsDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Фільтр за закріпленими новинами' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) {
      return undefined;
    }

    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return value as unknown;
  })
  @IsBoolean()
  isPinned?: boolean;
}
