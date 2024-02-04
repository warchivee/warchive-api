import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findBySocialIdOrCreateUser(loginDto: LoginDto) {
    const findUser = await this.userRepository.findOneBy({
      [`${loginDto.platform}_id`]: loginDto.platform_id,
    });

    if (findUser) {
      return findUser;
    }

    const createUser = this.userRepository.create({
      nickname: '익명',
      [`${loginDto.platform}_id`]: loginDto.platform_id,
    } as unknown as User);

    return await this.userRepository.save(createUser);
  }

  async findOne(findUserDto: FindUserDto) {
    return await this.userRepository.findOne({ where: { ...findUserDto } });
  }
}
