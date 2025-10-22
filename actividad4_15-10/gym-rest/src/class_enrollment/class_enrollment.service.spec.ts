import { Test, TestingModule } from '@nestjs/testing';
import { ClassEnrollmentService } from './class_enrollment.service';

describe('ClassEnrollmentService', () => {
  let service: ClassEnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassEnrollmentService],
    }).compile();

    service = module.get<ClassEnrollmentService>(ClassEnrollmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
