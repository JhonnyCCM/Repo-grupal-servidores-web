import { Test, TestingModule } from '@nestjs/testing';
import { GymClassCategoryController } from './gym-class_category.controller';
import { GymClassCategoryService } from './gym-class_category.service';

describe('GymClassCategoryController', () => {
  let controller: GymClassCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GymClassCategoryController],
      providers: [GymClassCategoryService],
    }).compile();

    controller = module.get<GymClassCategoryController>(GymClassCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
