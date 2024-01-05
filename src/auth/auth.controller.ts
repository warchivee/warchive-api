import { Controller, Get, Header, HttpCode, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

@ApiTags('OAuth')
@Controller('oauth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(302)
  @Get('kakao')
  @Header('Content-Type', 'text/html')
  async kakaoRedirect(@Res() res: Response): Promise<void> {
    res.redirect(this.authService.getKakaoLoginPage());
  }

  @Public()
  @Get('kakao/redirect')
  async getKakaoInfo(@Query() { code }: { code: string }) {
    return await this.authService.kakaoLogin(code);
  }
}
