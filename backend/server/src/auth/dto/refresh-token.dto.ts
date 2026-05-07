import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @Length(128, 128)
  @Matches(/^[a-f0-9]{128}$/)
  refreshToken: string;
}
