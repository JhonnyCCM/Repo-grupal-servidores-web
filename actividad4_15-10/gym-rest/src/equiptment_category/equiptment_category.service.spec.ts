import { Test, TestingModule } from '@nestjs/testing';
import { EquiptmentCategoryService } from './equiptment_category.service';

describe('EquiptmentCategoryService', () => {
  let service: EquiptmentCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquiptmentCategoryService],
    }).compile();

    service = module.get<EquiptmentCategoryService>(EquiptmentCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
