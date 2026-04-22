import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
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
