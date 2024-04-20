import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/dto/login.dto';
import { ScrapbookService } from 'src/scapbook/scapbook.service';
import { CreateScrapbookDto } from 'src/scapbook/dto/create-scapbook.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly scrapbookService: ScrapbookService,
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

    const user = await this.userRepository.save(createUser);

    const firstScrapbook: CreateScrapbookDto = {
      title: '첫번째 스크랩북',
      note: '당신의 첫번째 스크랩북이에요! 원하는 작품을 추가해보세요. 이곳을 클릭해 스크랩북의 이름과 설명을 변경할 수 있습니다.',
    };
    this.scrapbookService.createScrapbook(user, firstScrapbook);

    return user;
  }

  async findOne(findUserDto: FindUserDto) {
    return await this.userRepository.findOne({ where: { ...findUserDto } });
  }

  async deleteUser(user: User) {
    if (user.role === 'ADMIN') {
      throw new Error('어드민은 탈퇴할 수 없습니다.');
    }

    await this.scrapbookService.removeAll(user);
    await this.userRepository.remove(user);
  }
}
