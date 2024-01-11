import { Injectable } from '@nestjs/common';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthJwtService } from './jwt.service';
import { User } from 'src/user/entities/user.entity';
import { LoginDto } from './dto/login.dto';

/**
 * 참고 문서 : https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code
 */

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authJwtService: AuthJwtService,
  ) {}

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
