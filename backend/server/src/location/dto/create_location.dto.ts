import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ example: 49.839683, description: 'Широта (Latitude)' })
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({ example: 24.029717, description: 'Довгота (Longitude)' })
  @IsNumber()
  @IsNotEmpty()
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
