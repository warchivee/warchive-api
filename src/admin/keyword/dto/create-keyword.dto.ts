import { IsString, MaxLength } from 'class-validator';

export class CreateKeywordDto {
  @IsString()
  @MaxLength(20)
  name: string;
}
