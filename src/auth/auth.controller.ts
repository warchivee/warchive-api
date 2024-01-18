import { Body, Controller, Post, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '소셜 로그인',
    description: '소셜 정보로 로그인합니다.',
  })
  @Public()
  @Post('login')
  async login(@Res({ passthrough: true }) res, @Body() loginInfo: LoginDto) {
    const tokens = await this.authService.login(loginInfo);

    res.cookie('refresh_token', tokens.refresh_token.token, {
      sameSite: 'strict', // cross site 전송 허용 x
      secure: true, // https 요청에서만 전송
      httpOnly: true, // 쿠키 변조 차단 위해 js로 쿠키 조회 막음
      path: '/api/v1/auth/reissue', // 해당 요청에서만 이 쿠키를 전송함
      maxAge: tokens.refresh_token.expires_in, //쿠키 유효 시간
    });

    return { ...tokens.access_token, user: tokens.user };
  }

  @ApiCookieAuth('refresh_token')
  @ApiOperation({
    summary: '액세스토큰 갱신',
    description:
      '리프레시 토큰으로 액세스 토큰을 갱신합니다. 리프레시 토큰은 쿠키로 전송합니다.',
  })
  @Post('reissue')
  async refreshAccessToken(@Request() req) {
    const tokens = await this.authService.refreshAccessToken(req.user);

    return tokens.access_token;
  }
}
