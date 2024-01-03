import { Test, TestingModule } from '@nestjs/testing';
import { CautionController } from './caution.controller';
import { CautionService } from './caution.service';

describe('CautionController', () => {
  let controller: CautionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CautionController],
      providers: [CautionService],
    }).compile();

    controller = module.get<CautionController>(CautionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
