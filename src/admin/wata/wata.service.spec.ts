import { Test, TestingModule } from '@nestjs/testing';
import { WataService } from './wata.service';

describe('WataService', () => {
  let service: WataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WataService],
    }).compile();

    service = module.get<WataService>(WataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
