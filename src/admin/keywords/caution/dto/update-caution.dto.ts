import { PartialType } from '@nestjs/mapped-types';
import { CreateCautionDto } from './create-caution.dto';

export class UpdateCautionDto extends PartialType(CreateCautionDto) {}
