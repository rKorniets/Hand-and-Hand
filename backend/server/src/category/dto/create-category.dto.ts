import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Назва категорії',
    example: 'Медична допомога',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, {
    message: 'Назва категорії не може перевищувати 50 символів',
  })
  name: string;

  @ApiProperty({
    description: 'Унікальний ідентифікатор для URL',
    example: 'medical-help',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Slug не може перевищувати 50 символів' })
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Slug повинен містити тільки малі латинські літери, цифри та дефіси',
  })
  slug: string;
}
