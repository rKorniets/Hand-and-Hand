import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ResendVerificationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
