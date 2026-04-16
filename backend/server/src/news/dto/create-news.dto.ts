import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({ description: 'Заголовок новини' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Короткий опис' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Основний контент' })
  @IsString()
  main_content: string;

  @ApiProperty({ description: 'URL зображення' })
  @IsOptional()
  @IsString()
  image_url?: string;
}
