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
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Check if it's a 'refresh' request
      let payload = null;
      if (request.url.includes('refresh')) {
        payload = await this.authJwtService.validateRefresh(token);
      } else {
        payload = await this.authJwtService.validate(token);
      }

      request['user'] = payload;
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
