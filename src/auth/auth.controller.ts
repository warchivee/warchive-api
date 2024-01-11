import { Body, Controller, Post, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  tokenCommonOptions = {
    sameSite: 'strict',
    secure: true,
    httpOnly: true,
  };

  @Public()
  @Post('login')
  async login(@Res({ passthrough: true }) res, @Body() loginInfo: LoginDto) {
    const tokens = await this.authService.login(loginInfo);

    res.cookie('refresh_token', tokens.refresh_token.token, {
      ...this.tokenCommonOptions,
      path: '/api/v1/auth/reissue',
      maxAge: tokens.refresh_token.expires_in,
    });

    return { ...tokens.access_token, user: tokens.user };
  }

  @Post('reissue')
  async refreshAccessToken(@Request() req) {
    const tokens = await this.authService.refreshAccessToken(req.user);

    return tokens.access_token;
  }
}
