import { Test, TestingModule } from '@nestjs/testing';
import { GymClassCategoryService } from './gym-class_category.service';

describe('GymClassCategoryService', () => {
  let service: GymClassCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GymClassCategoryService],
    }).compile();

    service = module.get<GymClassCategoryService>(GymClassCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
