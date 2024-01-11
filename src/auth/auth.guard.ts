import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { AuthJwtService } from 'src/auth/jwt.service';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { TokenExpiredError } from '@nestjs/jwt';

//참고문서: https://docs.nestjs.com/security/authentication

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authJwtService: AuthJwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const cookie = request.cookies;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      if (request.url.includes('reissue')) {
        const refresh_token = cookie.refresh_token;
        request['user'] =
          await this.authJwtService.validateRefresh(refresh_token);
      } else {
        request['user'] = await this.authJwtService.validate(token);
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('토큰이 만료되었습니다.');
      } else {
        throw new UnauthorizedException();
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
