import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserService } from 'src/user/user.service';
import { KakaoToken, TokenType } from './interface/token.interface';
import { KakaoLoginInfo } from './interface/kakaoLoginInfo.interface';
import { AuthJwtService } from './jwt.service';
import { User } from 'src/user/entities/user.entity';

/**
 * 참고 문서 : https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code
 */

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly authJwtService: AuthJwtService,
  ) {}

  API_KEY = this.configService.get('KAKAO_API_KEY');
  REDIRECT_URL = this.configService.get('KAKAO_LOGIN_REDIRECT_URL');

  getKakaoLoginPage() {
    //step 1. 인가 코드 받기 https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code
    return `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.API_KEY}&redirect_uri=${this.REDIRECT_URL}`;
  }

  async kakaoLogin(code: string) {
    //step 2. 토큰 받기 https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
    const token = await this.getToken(this.API_KEY, this.REDIRECT_URL, code);

    // step 3. 사용자 로그인 처리
    const loginInfo = await this.getLoginInfo(
      token.token_type,
      token.access_token,
    );

    const user = await this.userService.findOrCreateUser(
      new CreateUserDto('익명', loginInfo.id),
    );

    const accessToken = this.authJwtService.generateAccessToken(user);
    const refreshToken = this.authJwtService.generateRefreshToken(user);

    return {
      user: user,
      access_token: accessToken,
      token_type: 'Bearer',
      refresh_token: refreshToken,
    };
  }

  async refreshAccessToken(user: User) {
    return { access_token: this.authJwtService.generateAccessToken(user) };
  }

  private async getToken(
    apiKey: string,
    redirectUri: string,
    code: string,
  ): Promise<KakaoToken> {
    const headers = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    const requestBody = {
      grant_type: 'authorization_code',
      client_id: apiKey,
      redirect_uri: redirectUri,
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

  private async getLoginInfo(
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
