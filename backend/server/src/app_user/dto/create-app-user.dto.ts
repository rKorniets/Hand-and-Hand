import { user_role_enum, user_status_enum } from '@prisma/client';

export class CreateAppUserDto {
  email: string;
  password_hash: string;
  role: user_role_enum;
  // When omitted, the service defaults this to user_status_enum.PENDING
  status?: user_status_enum;
  // When omitted, the service defaults this to 0
  points?: number;
}
