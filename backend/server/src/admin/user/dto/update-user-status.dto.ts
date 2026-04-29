import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { user_status_enum } from '@prisma/client';

export class UpdateUserStatusDto {
  @ApiProperty({
    enum: user_status_enum,
    description: 'Новий статус користувача',
  })
  @IsEnum(user_status_enum)
  status: user_status_enum;
}
