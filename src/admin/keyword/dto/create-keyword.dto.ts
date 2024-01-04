import { MaxLength } from 'class-validator';

export class CreateKeywordDto {
  @MaxLength(20)
  name: string;
}
