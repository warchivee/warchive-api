import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { SocialLoginDto } from './dto/socialLogin.dto';
import { AdminLoginDto } from './dto/adminLogin.dto';

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
  async socialLogin(
    @Res({ passthrough: true }) res,
    @Body() loginInfo: SocialLoginDto,
  ) {
    const tokens = await this.authService.socialLogin(loginInfo);

    /**
     * cookie 설정 참고
     * sameSite: 퍼스트파티/서드파티 설정 옵션. strict : 동일한 도메인에서만 이 쿠키가 전송됨(퍼스트파티), Lax: strict 설정에 일부 예외를 둠(GET api, a href, link href 등), none: 서드파티까지 전부 허용
     * secure: https 요청에서만 이 쿠키를 전송함
     * httpOnly: true 시 js로 쿠키를 조회 불가능 (쿠키 변조를 막음)
     * domain: 설정된 도메인과 그 하위 도메인으로만 쿠키를 전송함. (.localhost 설정 시 www.localhost 도 전부 ok), 따로 설정하지 않으면 해당 서버의 도메인을 따름.
     * path: 해당 path 의 요청으로만 이 쿠키를 전송함
     * maxAge: 쿠키의 유효 시간
     */
    res.cookie('refresh_token', tokens.refresh_token.token, {
      sameSite: 'none', //api 와 프론트의 도메인이 달라... none 으로 설정 (login 요청이 POST 라 Lax 가 안됨.)
      secure: true,
      httpOnly: true,
      path: '/api/v1/auth/reissue',
      domain: '.localhost',
      maxAge: tokens.refresh_token.expires_in,
    });

    return { ...tokens.access_token, user: tokens.user };
  }

  @ApiOperation({
    summary: '관리자 로그인',
    description: '관리자 정보로 로그인합니다.',
  })
  @Public()
  @Post('admin/login')
  async adminLogin(
    @Res({ passthrough: true }) res,
    @Body() loginInfo: AdminLoginDto,
  ) {
    const tokens = await this.authService.adminLogin(loginInfo);

    res.cookie('refresh_token', tokens.refresh_token.token, {
      sameSite: 'none', //api 와 프론트의 도메인이 달라... none 으로 설정 (login 요청이 POST 라 Lax 가 안됨.)
      secure: true,
      httpOnly: true,
      path: '/api/v1/auth/reissue',
      maxAge: tokens.refresh_token.expires_in,
    });

    return { ...tokens.access_token, user: tokens.user };
  }

  @ApiCookieAuth('refresh_token')
  @ApiOperation({
    summary: '액세스토큰 갱신',
    description:
      '리프레시 토큰으로 액세스 토큰을 갱신합니다. 리프레시 토큰은 쿠키로 전송합니다.',
  })
  @Get('reissue')
  async refreshAccessToken(@Request() req) {
    const tokens = await this.authService.refreshAccessToken(req.user);

    return { ...tokens.access_token, user: tokens.user };
  }

  @ApiOperation({
    summary: '회원탈퇴',
    description: '유저와 관련된 와카이브 db의 모든 정보를 삭제합니다.',
  })
  @Delete('withdrawal')
  async widthdrawal(@Request() req) {
    await this.authService.withdrawal(req.user);
  }
}
