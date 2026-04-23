import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateFundraisingCampaignDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  main_content: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsPositive()
  goal_amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  start_at?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  end_at?: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  jar_link: string;

  @ApiProperty()
  @IsString()
  mono_token: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  image_url?: string;
}
