import { Test, TestingModule } from '@nestjs/testing';
import { EquiptmentService } from './equiptment.service';

describe('EquiptmentService', () => {
  let service: EquiptmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquiptmentService],
    }).compile();

    service = module.get<EquiptmentService>(EquiptmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
