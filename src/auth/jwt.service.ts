import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

/**
 * 프론트에서 JWT 토큰 확인:
 * 프론트엔드에서 JWT 토큰이 있으면 로그인을 패스하고 해당 토큰을 이용하여 요청을 보냅니다.
 * 만약 액세스 토큰이 만료되면, 프론트엔드는 리프레시 토큰을 사용하여 토큰을 갱신합니다.
 *
 * JWT 토큰 만료 처리:
 * 액세스 토큰이 만료된 경우, 백엔드에서 만료되었다는 에러를 응답합니다.
 * 프론트엔드는 리프레시 토큰을 사용하여 갱신 요청을 보냅니다.
 * 만약 리프레시 토큰도 만료되었다면, 프론트엔드는 사용자에게 카카오 로그인하기 버튼이 있는 메인 화면을 보여줍니다.
 */

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  private readonly JWT_SECRET = this.configService.get('JWT_SECRET');
  private readonly JWT_REFRESH_SECRET =
    this.configService.get('JWT_REFRESH_SECRET');

  async validate(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.JWT_SECRET,
    });

    return payload;
  }

  async validateRefresh(refreshToken: string) {
    // 리프레시 토큰 검증
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.JWT_REFRESH_SECRET,
    });

    // 예시: 디코딩된 토큰에서 사용자 정보 가져오기
    const user: User = await this.userService.findOne(payload.id);

    return user;
  }

  generateAccessToken(user: User): string {
    const payload = {
      id: user.id,
      nickname: user.nickname,
      role: user.role,
    };
    const options = { secret: this.JWT_SECRET, expiresIn: '1h' };

    return this.jwtService.sign(payload, options);
  }

  generateRefreshToken(user: User): string {
    const payload = {
      id: user.id,
      nickname: user.nickname,
      role: user.role,
    };
    const options = { secret: this.JWT_REFRESH_SECRET, expiresIn: '30d' };

    return this.jwtService.sign(payload, options);
  }
}
