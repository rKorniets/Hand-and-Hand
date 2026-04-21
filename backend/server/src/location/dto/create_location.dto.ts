import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

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

  @ApiProperty({ example: 'вул. Соборна, 1', description: 'Повна адреса' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'Львівська область',
    description: 'Область / Регіон',
  })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ example: 'Львів', description: 'Місто' })
  @IsString()
  @IsNotEmpty()
  city: string;
}
