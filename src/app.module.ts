import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './admin/keywords/category/category.module';
import { GenreModule } from './admin/keywords/genre/genre.module';
import { KeywordModule } from './admin/keywords/keyword/keyword.module';
import { CautionModule } from './admin/keywords/caution/caution.module';
import { WataModule } from './admin/wata/wata.module';
import { PlatformModule } from './admin/keywords/platform/platform.module';
import { KeywordsModule } from './admin/keywords/keywords.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [`${__dirname}/**/entities/*.entity.{ts,js}`],
        synchronize: true,
        timezone: 'Asia/Seoul',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    GenreModule,
    KeywordModule,
    CautionModule,
    WataModule,
    PlatformModule,
    KeywordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
