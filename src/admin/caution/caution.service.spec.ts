import { Test, TestingModule } from '@nestjs/testing';
import { CautionService } from './caution.service';

describe('CautionService', () => {
  let service: CautionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CautionService],
    }).compile();

    service = module.get<CautionService>(CautionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
