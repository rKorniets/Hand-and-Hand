import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ticket_priority_enum } from '@prisma/client';

export class CreateTicketLocationDto {
  @ApiProperty({ example: 'Київ' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'вул. Хрещатик, 1' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Київська область' })
  @IsString()
  region: string;

  @ApiPropertyOptional({ example: 50.4501 })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 30.5234 })
  @IsOptional()
  @IsNumber()
  lng?: number;
}

export class CreateTicketDto {
  @ApiProperty({
    example: 'Потрібна машина для доставки гуманітарної допомоги',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Необхідно перевезти 50 коробок з продуктами з Львова до Херсона',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    example: [1, 2],
    description: 'Масив ID категорій',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  category_ids?: number[];

  @ApiPropertyOptional({
    enum: ticket_priority_enum,
    example: ticket_priority_enum.MEDIUM,
    default: ticket_priority_enum.MEDIUM,
  })
  @IsOptional()
  @IsEnum(ticket_priority_enum)
  priority?: ticket_priority_enum;

  @ApiPropertyOptional({
    type: () => CreateTicketLocationDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTicketLocationDto)
  location?: CreateTicketLocationDto;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/example/image/upload/file.jpg',
  })
  @IsOptional()
  @IsString()
  file_url?: string;
}
