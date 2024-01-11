import { IsString } from 'class-validator';

export class CreateCautionDto {
  @IsString()
  name: string;
}
