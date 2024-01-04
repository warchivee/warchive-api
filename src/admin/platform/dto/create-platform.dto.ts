import { MaxLength } from 'class-validator';

export class CreatePlatformDto {
  @MaxLength(20)
  name: string;
}
