import { Test, TestingModule } from '@nestjs/testing';
import { BookclubReviewController } from './bookclub-review.controller';
import { BookclubReviewService } from './bookclub-review.service';

describe('BookclubReviewController', () => {
  let controller: BookclubReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookclubReviewController],
      providers: [BookclubReviewService],
    }).compile();

    controller = module.get<BookclubReviewController>(BookclubReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
