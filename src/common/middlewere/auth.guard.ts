import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { AuthJwtService } from 'src/auth/jwt.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TokenExpiredError } from '@nestjs/jwt';
import { IS_ADMIN_KEY } from '../decorators/admin.decorator';

//docs: https://docs.nestjs.com/security/authentication

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authJwtService: AuthJwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.passAuth(context)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const cookie = request.cookies;

    if (!token) {
      throw new UnauthorizedException('액세스 토큰을 전송해주세요.');
    }

    const isReissueRequest = request.url.includes('reissue');

    // 액세스토큰 갱신 요청이면 cookie 에 담긴 refresh token 을 검증한다.
    if (isReissueRequest) {
      try {
        const user = await this.authJwtService.validateRefresh(
          cookie.refresh_token,
        );

        request['user'] = user;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw new UnauthorizedException('리프레시 토큰이 만료되었습니다.');
        }

        throw new UnauthorizedException(error?.message);
      }
    } else {
      try {
        const user = await this.authJwtService.validate(token);

        // admin 요청은 ADMIN 권한을 가진 유저만 요청 가능하다.
        if (this.checkAdmin(context) && user.role !== 'ADMIN') {
          throw new ForbiddenException();
        }

        request['user'] = user;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw new UnauthorizedException('액세스 토큰이 만료되었습니다.');
        }

        throw new UnauthorizedException(error?.message);
      }
    }

    return true;
  }

  private passAuth(context: ExecutionContext): boolean {
    // @@Public 데코레이터가 붙은 controller 는 인증하지 않는다.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return false;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private checkAdmin(context: ExecutionContext): boolean {
    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isAdmin) {
      return true;
    }

    return false;
  }
}
