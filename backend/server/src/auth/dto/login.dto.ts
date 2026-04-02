import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginOrganizationDto {
  @IsString()
  @Length(8, 8)
  @Matches(/^\d{8}$/, { message: 'ЄДРПОУ must be exactly 8 digits' })
  edrpou: string;

  @IsString()
  @MinLength(8)
  password: string;
}
