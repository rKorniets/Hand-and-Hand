import { ApiProperty, ApiPropertyOptions} from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ example: 49.839683, description: 'Широта (Latitude)' })
  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ example: 24.029717, description: 'Довгота (Longitude)' })
  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  lng: number;

  @ApiProperty({ example: 'вул. Соборна, 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @ApiProperty({ example: 'Львівська область' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  region: string;

  @ApiProperty({ example: 'Львів' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;
}
