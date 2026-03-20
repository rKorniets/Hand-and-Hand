import { user_role_enum, user_status_enum } from '@prisma/client';

export class CreateAppUserDto {
  email: string;
  password_hash: string;
  role: user_role_enum;
  status: user_status_enum;
  points: number;
}
