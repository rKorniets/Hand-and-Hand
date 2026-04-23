import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateProjectDto } from '../../../project/dto/create-project.dto';

export class CreateProjectAdminDto extends CreateProjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  organization_profile_id?: number;
}
