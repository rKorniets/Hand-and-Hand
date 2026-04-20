import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateFundraisingCampaignDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  organization_profile_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  volunteer_profile_id?: number;

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
  goal_amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  start_at?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
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
  image_url?: string;
}
