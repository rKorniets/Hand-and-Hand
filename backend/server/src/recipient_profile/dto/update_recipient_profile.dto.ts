import { PartialType } from '@nestjs/swagger';
import { CreateRecipientProfileDto } from './create_recipient_profile.dto';

export class UpdateRecipientProfileDto extends PartialType(
  CreateRecipientProfileDto,
) {}
