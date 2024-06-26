import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthJwtService } from './jwt.service';
import { AuthGuard } from '../common/middlewere/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'dev'
          ? '.dev.env'
          : process.env.NODE_ENV === 'prod'
            ? '.prod.env'
            : process.env.NODE_ENV === 'ssl'
              ? '.ssl.env'
              : '.env',
    }),
    JwtModule.register({}),
    UserModule,
  ],
  providers: [
    AuthService,
    AuthJwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
