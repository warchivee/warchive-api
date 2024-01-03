import { PartialType } from '@nestjs/mapped-types';
import { CreateWataDto } from './create-wata.dto';

export class UpdateWataDto extends PartialType(CreateWataDto) {}
