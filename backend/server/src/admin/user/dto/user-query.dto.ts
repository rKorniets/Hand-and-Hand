import { IsOptional, IsEnum, IsInt, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { user_role_enum, user_status_enum } from '@prisma/client';

export class UserQueryDto {
  @ApiPropertyOptional({ enum: user_role_enum })
  @IsOptional()
  @IsEnum(user_role_enum)
  role?: user_role_enum;

  @ApiPropertyOptional({ enum: user_status_enum })
  @IsOptional()
  @IsEnum(user_status_enum)
  status?: user_status_enum;

  @ApiPropertyOptional({ description: 'Пошук за email, імʼям або прізвищем' })
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
