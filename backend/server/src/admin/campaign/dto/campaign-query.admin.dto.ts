import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { fundraising_campaign_status_enum } from '@prisma/client';

export class CampaignQueryAdminDto {
  @ApiPropertyOptional({ enum: fundraising_campaign_status_enum })
  @IsOptional()
  @IsEnum(fundraising_campaign_status_enum)
  status?: fundraising_campaign_status_enum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;
}
