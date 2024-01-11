import { IsNumber, IsString } from 'class-validator';

export class LoginDto {
  @IsNumber()
  platform_id: number;

  @IsString()
  platform: 'kakao';
}
