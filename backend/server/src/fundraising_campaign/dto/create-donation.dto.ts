import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDonationDto {
  @ApiProperty({ description: 'Сума донату', example: 500 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({ description: "Ім'я благодійника" })
  @IsOptional()
  @IsString()
  donor_name?: string;

  @ApiPropertyOptional({ description: 'Коментар' })
  @IsOptional()
  @IsString()
  message?: string;
}
