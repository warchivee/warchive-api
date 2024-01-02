import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

/**
 * 참고 문서 : https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code
 */

@Controller('oauth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  API_KEY = this.configService.get('KAKAO_API_KEY');
  REDIRECT_URL = this.configService.get('KAKAO_LOGIN_REDIRECT_URL');

  @Get('kakao-login-page')
  @Header('Content-Type', 'text/html')
  async kakaoRedirect(@Res() res: Response): Promise<void> {
    //step 1. 인가 코드 받기 https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code
    //redirect_url 은 인가코드 받은 후 로그인 처리를 위해 리다이렉트할 우리 서버의 url 입니다.

    const getCodePageUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.API_KEY}&redirect_uri=${this.REDIRECT_URL}`;

    res.redirect(getCodePageUrl);
  }

  @Get('kakao')
  async getKakaoInfo(@Query() { code }: { code: string }) {
    //step 2. 토큰 받기 ~ step 3. 사용자 로그인 처리
    await this.authService.kakaoLogin(this.API_KEY, this.REDIRECT_URL, code);
  }
}
