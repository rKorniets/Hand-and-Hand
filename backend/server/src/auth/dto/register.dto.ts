import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum RegisterRole {
  VOLUNTEER = 'VOLUNTEER',
  ORGANIZATION = 'ORGANIZATION',
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(RegisterRole)
  role: RegisterRole;

  @IsString()
  displayName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  bio?: string;
}
