import { IsEnum, IsOptional } from 'class-validator';
import { points_transaction_type_enum } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class PointsQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: points_transaction_type_enum,
    description: 'Фільтр за типом транзакції',
  })
  @IsOptional()
  @IsEnum(points_transaction_type_enum)
  type?: points_transaction_type_enum;
}
