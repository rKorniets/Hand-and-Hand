import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ConfirmTaskAssignmentDto {
  @ApiProperty({
    description:
      'true — підтвердити виконання (нараховує бали, якщо таска COMPLETED); false — зняти підтвердження',
    example: true,
  })
  @IsBoolean()
  confirmed: boolean;
}
