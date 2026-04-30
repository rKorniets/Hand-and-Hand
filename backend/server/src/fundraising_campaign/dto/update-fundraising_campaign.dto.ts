import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateFundraisingCampaignDto } from './create-fundraising_campaign.dto';

export class UpdateFundraisingCampaignDto extends PartialType(
  OmitType(CreateFundraisingCampaignDto, ['jar_link', 'mono_token'] as const),
) {}
