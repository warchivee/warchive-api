import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { KakaoToken, TokenType } from './interface/kakaoToken.interface';
import { KakaoLoginInfo } from './interface/kakaoLoginInfo.interface';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async kakaoLogin(code: string) {
    //step 2. 토큰 받기 https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
    const token = await this.getToken(code);

    // step 3. 사용자 로그인 처리
    const loginInfo = await this.getLoginInfo(
      token.token_type,
      token.access_token,
    );

    console.log(loginInfo);
  }

  async getToken(code: string): Promise<KakaoToken> {
    const headers = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    const requestBody = {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_API_KEY,
      redirect_uri: process.env.KAKAO_LOGIN_REDIRECT_URL,
      code,
    };

    const params = new URLSearchParams(requestBody).toString();

    const { data } = await firstValueFrom(
      this.httpService
        .post<KakaoToken>(`https://kauth.kakao.com/oauth/token`, params, {
          headers,
        })
        .pipe(),
    );

    return data;
  }

  async getLoginInfo(
    tokenType: TokenType,
    accessToken: string,
  ): Promise<KakaoLoginInfo> {
    const headers = {
      Authorization: `${tokenType} ${accessToken}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    const { data } = await firstValueFrom(
      this.httpService
        .get<KakaoLoginInfo>(`https://kapi.kakao.com/v2/user/me`, {
          headers,
        })
        .pipe(),
    );

    return data;
  }
}
