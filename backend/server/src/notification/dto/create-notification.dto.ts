import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { notification_type_enum } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsInt()
  user_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message: string;

  @ApiPropertyOptional({ enum: notification_type_enum })
  @IsOptional()
  @IsEnum(notification_type_enum)
  type?: notification_type_enum;
}

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
