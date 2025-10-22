import { PartialType } from '@nestjs/swagger';
import { CreateEquiptmentCategoryDto } from './create-equiptment_category.dto';

export class UpdateEquiptmentCategoryDto extends PartialType(CreateEquiptmentCategoryDto) {}
