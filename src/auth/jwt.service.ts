import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

export interface TokenType {
  token: string;
  expires_in: number;
}

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly JWT_SECRET = this.configService.get('JWT_SECRET');
  private readonly JWT_REFRESH_SECRET =
    this.configService.get('JWT_REFRESH_SECRET');
  private readonly JWT_EXPIRES_IN = this.configService.get('JWT_EXPIRES_IN');
  private readonly JWT_REFRESH_EXPIRES_IN = this.configService.get(
    'JWT_RESRESH_EXPIRES_IN',
  );

  async validate(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.JWT_SECRET,
    });

    return payload;
  }

  async validateRefresh(token: string) {
    const payloadRefresh = await this.jwtService.verifyAsync(token, {
      secret: this.JWT_REFRESH_SECRET,
    });

    return payloadRefresh;
  }

  generateAccessToken(user: User): TokenType {
    const payload = {
      id: user.id,
      role: user.role,
    };
    const options = {
      secret: this.JWT_SECRET,
      expiresIn: this.JWT_EXPIRES_IN,
    };

    const token = this.jwtService.sign(payload, options);
    const expiresIn = this.JWT_EXPIRES_IN;

    return {
      token,
      expires_in: expiresIn,
    };
  }

  generateRefreshToken(user: User): TokenType {
    const payload = {
      id: user.id,
      role: user.role,
    };
    const options = {
      secret: this.JWT_REFRESH_SECRET,
      expiresIn: this.JWT_REFRESH_EXPIRES_IN,
    };

    const token = this.jwtService.sign(payload, options);
    const expiresIn = this.JWT_REFRESH_EXPIRES_IN;

    return {
      token,
      expires_in: expiresIn,
    };
  }
}
