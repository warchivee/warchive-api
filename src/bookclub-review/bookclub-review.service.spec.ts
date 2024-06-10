import { Test, TestingModule } from '@nestjs/testing';
import { BookclubReviewService } from './bookclub-review.service';

describe('BookclubReviewService', () => {
  let service: BookclubReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookclubReviewService],
    }).compile();

    service = module.get<BookclubReviewService>(BookclubReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
