import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { CreateVolunteerProfileDto } from '../../../volunteer_profile/dto/create-volunteer-profile.dto';

export class CreateVolunteerProfileAdminDto extends CreateVolunteerProfileDto {
  @ApiProperty({ description: 'ID користувача-власника профілю' })
  @IsInt()
  user_id: number;
}
