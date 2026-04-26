import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';
import { CreateVolunteerProfileDto } from './create-volunteer-profile.dto';

export class UpdateVolunteerProfileDto extends PartialType(
  CreateVolunteerProfileDto,
) {
  @ApiPropertyOptional({
    description: 'URL завантаженого документа для верифікації',
  })
  @IsOptional()
  @IsUrl()
  docs_url?: string;
}
