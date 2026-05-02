import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { notification_type_enum } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrgNotificationDto {
  @ApiProperty()
  @IsInt()
  organization_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ enum: notification_type_enum })
  @IsOptional()
  @IsEnum(notification_type_enum)
  type?: notification_type_enum;
}
