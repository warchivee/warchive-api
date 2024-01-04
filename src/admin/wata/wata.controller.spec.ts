import { Test, TestingModule } from '@nestjs/testing';
import { WataController } from './wata.controller';
import { WataService } from './wata.service';

describe('WataController', () => {
  let controller: WataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WataController],
      providers: [WataService],
    }).compile();

    controller = module.get<WataController>(WataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
