import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { recipient_type_enum } from '@prisma/client';

export class CreateRecipientProfileDto {
  @ApiProperty({ description: 'ID користувача з таблиці app_user', example: 1 })
  user_id: number;

  @ApiProperty({
    enum: recipient_type_enum,
    description: 'Тип (PERSON - людина, SHELTER - притулок, OTHER - інше)',
    example: recipient_type_enum.PERSON,
  })
  recipient_type: recipient_type_enum;

  @ApiProperty({ description: "Ім'я людини або назва організації", example: 'Притулок "Хвостики"' })
  name: string;

  @ApiPropertyOptional({ description: 'Детальний опис (необов\'язково)' })
  description?: string;

  @ApiProperty({ description: 'Контактна інформація (телефон, email)', example: '+380991234567' })
  contact_info: string;

  @ApiPropertyOptional({ description: 'ID локації за замовчуванням' })
  default_location_id?: number;
}
