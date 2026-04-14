import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { fundraising_campaign_status_enum } from '@prisma/client';

export class UpdateCampaignStatusAdminDto {
  @ApiProperty({ enum: fundraising_campaign_status_enum })
  @IsEnum(fundraising_campaign_status_enum)
  status: fundraising_campaign_status_enum;
}
