import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  city: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class RegisterOrganizationDto {
  @IsString()
  name: string;

  @IsString()
  @Length(8, 8)
  @Matches(/^\d{8}$/, { message: 'ЄДРПОУ must be exactly 8 digits' })
  edrpou: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
