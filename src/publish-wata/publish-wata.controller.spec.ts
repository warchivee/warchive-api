import { Test, TestingModule } from '@nestjs/testing';
import { PublishWataController } from './publish-wata.controller';
import { PublishWataService } from './publish-wata.service';

describe('PublishWataController', () => {
  let controller: PublishWataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublishWataController],
      providers: [PublishWataService],
    }).compile();

    controller = module.get<PublishWataController>(PublishWataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
