import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({ description: 'Заголовок новини' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Короткий опис' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ description: 'Основний контент' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  main_content: string;

  @ApiPropertyOptional({ description: 'URL зображення' })
  @IsOptional()
  @IsString()
  @IsUrl()
  image_url?: string;
}
