import { Test, TestingModule } from '@nestjs/testing';
import { EquiptmentCategoryController } from './equiptment_category.controller';
import { EquiptmentCategoryService } from './equiptment_category.service';

describe('EquiptmentCategoryController', () => {
  let controller: EquiptmentCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquiptmentCategoryController],
      providers: [EquiptmentCategoryService],
    }).compile();

    controller = module.get<EquiptmentCategoryController>(EquiptmentCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
