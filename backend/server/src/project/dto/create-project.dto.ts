import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { project_status_enum } from '@prisma/client';
export class CreateProjectDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  status?: project_status_enum;

  @ApiPropertyOptional()
  starts_at?: string;

  @ApiPropertyOptional()
  ends_at?: string;
}
