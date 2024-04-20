import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { ScrapbookModule } from 'src/scapbook/scapbook.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ScrapbookModule],
  providers: [UserService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
