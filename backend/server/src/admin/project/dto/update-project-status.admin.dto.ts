import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { project_status_enum } from '@prisma/client';

export class UpdateProjectStatusAdminDto {
  @ApiProperty({ enum: project_status_enum })
  @IsEnum(project_status_enum)
  status: project_status_enum;
}
