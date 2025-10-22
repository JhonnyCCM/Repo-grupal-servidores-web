import { PartialType } from '@nestjs/swagger';
import { CreateClassEnrollmentDto } from './create-class_enrollment.dto';

export class UpdateClassEnrollmentDto extends PartialType(CreateClassEnrollmentDto) {}
