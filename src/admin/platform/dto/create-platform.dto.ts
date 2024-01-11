import { IsString, MaxLength } from 'class-validator';

export class CreatePlatformDto {
  @IsString()
  @MaxLength(20)
  name: string;
}
