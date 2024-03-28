import { Test, TestingModule } from '@nestjs/testing';
import { PublishWataService } from './publish-wata.service';

describe('PublishWataService', () => {
  let service: PublishWataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublishWataService],
    }).compile();

    service = module.get<PublishWataService>(PublishWataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
