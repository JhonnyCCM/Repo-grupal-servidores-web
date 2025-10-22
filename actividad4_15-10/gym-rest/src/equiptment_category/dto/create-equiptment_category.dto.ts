import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateEquiptmentCategoryDto {
    @ApiProperty({
        description: 'ID del equipo',
        example: 'uuid-equipment-id'
    })
    @IsUUID('4', { message: 'El ID del equipo debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del equipo es obligatorio' })
    equiptmentId: string;

    @ApiProperty({
        description: 'ID de la categoría',
        example: 'uuid-category-id'
    })
    @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID de la categoría es obligatorio' })
    categoryId: string;
}
