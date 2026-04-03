import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Назва категорії', example: 'Медична допомога' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Унікальний ідентифікатор для URL',
    example: 'medical-help',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Slug повинен містити тільки малі латинські літери, цифри та дефіси',
  })
  slug: string;
}
