import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/findUser.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOrCreateUser(createUserDto: CreateUserDto) {
    const findUser = await this.userRepository.findOneBy({
      kakaoId: createUserDto.kakaoId,
    });

    if (!findUser) {
      const createUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(createUser);
    }

    return findUser;
  }

  async findOne(findUserDto: FindUserDto) {
    return await this.userRepository.findOne({ where: { ...findUserDto } });
  }
}
