import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './admin/category/category.module';
import { GenreModule } from './admin/genre/genre.module';
import { KeywordModule } from './admin/keyword/keyword.module';
import { CautionModule } from './admin/caution/caution.module';
import { WataModule } from './admin/wata/wata.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
