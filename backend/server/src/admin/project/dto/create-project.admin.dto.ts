import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateProjectDto } from '../../../project/dto/create-project.dto';

export class CreateProjectAdminDto extends OmitType(CreateProjectDto, [
  'organization_profile_id',
] as const) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  organization_profile_id?: number;
}
