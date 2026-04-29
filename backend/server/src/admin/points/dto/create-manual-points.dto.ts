import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { points_transaction_type_enum } from '@prisma/client';

export class CreateManualPointsDto {
  @ApiProperty({ description: 'ID користувача' })
  @IsInt()
  userId: number;

  @ApiProperty({
    enum: [
      points_transaction_type_enum.BONUS,
      points_transaction_type_enum.PENALTY,
      points_transaction_type_enum.ADJUSTMENT,
    ],
    description: 'Тип транзакції',
  })
  @IsEnum([
    points_transaction_type_enum.BONUS,
    points_transaction_type_enum.PENALTY,
    points_transaction_type_enum.ADJUSTMENT,
  ])
  type: points_transaction_type_enum;

  @ApiProperty({ description: 'Кількість балів', minimum: 1 })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({ description: 'Коментар' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
