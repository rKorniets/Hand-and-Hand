import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { CreateOrganizationProfileDto } from '../../../organization_profile/dto/create-organization-profile.dto';

export class CreateOrgProfileAdminDto extends CreateOrganizationProfileDto {
  @ApiProperty({ description: 'ID користувача-власника профілю' })
  @IsInt()
  user_id: number;
}
