import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CollectionModule } from 'src/collection/collection.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CollectionModule],
  providers: [UserService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
