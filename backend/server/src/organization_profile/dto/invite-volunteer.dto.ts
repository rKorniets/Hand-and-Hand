import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class InviteVolunteerDto {
  @ApiProperty({ description: 'ID користувача-волонтера' })
  @IsInt()
  @Min(1)
  user_id: number;
}
