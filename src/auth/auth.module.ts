import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.starategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.env',
    }),
    HttpModule,
    JwtModule.register({}),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
