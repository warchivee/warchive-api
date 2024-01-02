export class CreateUserDto {
  readonly nickname: string;
  readonly kakaoId: number;

  constructor(nickname: string, kakaoId: number) {
    this.nickname = nickname;
    this.kakaoId = kakaoId;
  }
}
