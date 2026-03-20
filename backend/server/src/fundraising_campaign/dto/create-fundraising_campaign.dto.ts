import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { fundraising_campaign_status_enum } from '@prisma/client';

export class CreateFundraisingCampaignDto {
  @ApiPropertyOptional()
  organization_profile_id?: number;

  @ApiPropertyOptional()
  volunteer_profile_id?: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  goal_amount: number;

  @ApiPropertyOptional()
  current_amount?: number;

  @ApiPropertyOptional()
  status?: fundraising_campaign_status_enum;

  @ApiPropertyOptional()
  start_at?: string;

  @ApiPropertyOptional()
  end_at?: string;

  @ApiPropertyOptional()
  bank_link?: string;

  @ApiPropertyOptional()
  image_url?: string;
}
