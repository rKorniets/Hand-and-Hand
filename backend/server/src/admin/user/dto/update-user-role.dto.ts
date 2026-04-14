import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { user_role_enum } from '@prisma/client';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: user_role_enum, description: 'Нова роль користувача' })
  @IsEnum(user_role_enum)
  role: user_role_enum;
}
