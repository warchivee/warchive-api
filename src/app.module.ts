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
import { CollectionModule } from './collection/collection.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        name: 'default',
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [`${__dirname}/**/entities/*.entity.{ts,js}`],
        synchronize: false, //true 로 하면 ddl 이 자동으로 동기화되지만, 데이터가 날아가므로 사용 x, 개발 단계에서만 사용.
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
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
    CollectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
