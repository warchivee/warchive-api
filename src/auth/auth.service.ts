import { Injectable } from '@nestjs/common';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthJwtService } from './jwt.service';
import { User } from 'src/user/entities/user.entity';
import { LoginDto } from './dto/login.dto';

// docs : https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authJwtService: AuthJwtService,
  ) {}

  /**
   * 전달 받은 소셜로그인 사용자 정보로 로그인을 처리한다.
   * 만약 이전에 로그인한 적 없는 사용자라면 사용자 정보를 추가하고
   * 이전에 로그인한 적 있는 사용자라면 기존 정보를 응답해준다.
   *
   * @param loginDto 소셜로그인 사용자 정보 (소셜플랫폼 정보, 소셜플랫폼의 유저 uuid)
   * @returns 액세스토큰, 리프레시토큰, 유저정보
   */
  async login(loginDto: LoginDto) {
    const user = await this.userService.findOrCreateUser(
      new CreateUserDto('익명', loginDto.platform_id),
    );

    const accessToken = this.authJwtService.generateAccessToken(user);
    const refreshToken = this.authJwtService.generateRefreshToken(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: user,
    };
  }

  async refreshAccessToken(user: User) {
    return { access_token: this.authJwtService.generateAccessToken(user) };
  }
}
