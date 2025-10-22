import { Test, TestingModule } from '@nestjs/testing';
import { ClassEnrollmentController } from './class_enrollment.controller';
import { ClassEnrollmentService } from './class_enrollment.service';

describe('ClassEnrollmentController', () => {
  let controller: ClassEnrollmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassEnrollmentController],
      providers: [ClassEnrollmentService],
    }).compile();

    controller = module.get<ClassEnrollmentController>(ClassEnrollmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
