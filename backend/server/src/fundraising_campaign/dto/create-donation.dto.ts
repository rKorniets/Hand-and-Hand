import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateDonationDto {
  @ApiProperty({ description: 'Сума донату', example: 500 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({ description: "Ім'я благодійника", maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: "Ім'я не може перевищувати 100 символів" })
  donor_name?: string;

  @ApiPropertyOptional({ description: 'Коментар', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Коментар не може перевищувати 500 символів' })
  message?: string;
}
