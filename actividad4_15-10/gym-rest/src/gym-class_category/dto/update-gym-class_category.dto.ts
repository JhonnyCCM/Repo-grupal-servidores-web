import { PartialType } from '@nestjs/swagger';
import { CreateGymClassCategoryDto } from './create-gym-class_category.dto';

export class UpdateGymClassCategoryDto extends PartialType(CreateGymClassCategoryDto) {}
