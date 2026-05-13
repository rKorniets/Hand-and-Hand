import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, IsEnum } from 'class-validator';

export enum NotifyTaskType {
  FUNDRAISER_CREATED = 'fundraiser_created',
  EVENT_CREATED = 'event_created',
}

export class NotifyFromTaskDto {
  @ApiProperty({ example: 42, description: 'ID задачі (task)' })
  @IsInt()
  @IsPositive()
  task_id: number;

  @ApiProperty({ enum: NotifyTaskType })
  @IsEnum(NotifyTaskType)
  type: NotifyTaskType;

  @ApiProperty({ example: 7, description: 'ID створеного збору або події' })
  @IsInt()
  @IsPositive()
  source_id: number;

  @ApiProperty({ example: 'Допомога пораненим бійцям' })
  @IsString()
  title: string;
}
