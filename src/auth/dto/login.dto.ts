import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

type SocialPlatform = 'kakao';

export class LoginDto {
  @ApiProperty({ description: '소셜 플랫폼의 유저 id' })
  @IsNumber()
  platform_id: number;

  @ApiProperty({ description: '소셜 플랫폼 종류 (현재는 카카오 뿐입니다.)' })
  @IsString()
  platform: SocialPlatform;
}
