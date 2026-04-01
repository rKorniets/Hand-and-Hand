import { PartialType } from '@nestjs/swagger';
import { Create_warningDto } from './create_warning.dto';

export class Update_warningDto extends PartialType(Create_warningDto) {}
