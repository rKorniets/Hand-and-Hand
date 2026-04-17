import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({
    description: 'Короткий заголовок тікету',
    example: 'Потрібна машина для доставки',
  })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Детальний опис проблеми' })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: "ID локації (якщо тікет прив'язаний до місця)",
    example: 5,
  })
  @IsOptional()
  @IsInt()
  location_id?: number;
}
