import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateReportDto } from '../../../report/dto/create-report.dto';

export class CreateReportAdminDto extends CreateReportDto {
  @ApiProperty()
  @IsNumber()
  organization_profile_id: number;
}
