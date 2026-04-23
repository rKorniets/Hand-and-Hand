import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateFundraisingCampaignDto } from '../../../fundraising_campaign/dto/create-fundraising_campaign.dto';

export class CreateCampaignAdminDto extends CreateFundraisingCampaignDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  organization_profile_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  volunteer_profile_id?: number;
}
