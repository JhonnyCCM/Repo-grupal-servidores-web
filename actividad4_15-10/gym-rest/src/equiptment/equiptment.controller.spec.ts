import { Test, TestingModule } from '@nestjs/testing';
import { EquiptmentController } from './equiptment.controller';
import { EquiptmentService } from './equiptment.service';

describe('EquiptmentController', () => {
  let controller: EquiptmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquiptmentController],
      providers: [EquiptmentService],
    }).compile();

    controller = module.get<EquiptmentController>(EquiptmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
