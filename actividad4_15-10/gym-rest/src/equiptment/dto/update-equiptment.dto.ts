import { PartialType } from '@nestjs/swagger';
import { CreateEquiptmentDto } from './create-equiptment.dto';

export class UpdateEquiptmentDto extends PartialType(CreateEquiptmentDto) {}
