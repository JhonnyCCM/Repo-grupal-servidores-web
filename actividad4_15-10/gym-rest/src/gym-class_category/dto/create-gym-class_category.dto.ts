import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateGymClassCategoryDto {
    @ApiProperty({
        description: 'ID de la clase de gimnasio',
        example: 'uuid-class-id'
    })
    @IsUUID('4', { message: 'El ID de la clase debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID de la clase es obligatorio' })
    classId: string;

    @ApiProperty({
        description: 'ID de la categoría',
        example: 'uuid-category-id'
    })
    @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID de la categoría es obligatorio' })
    categoryId: string;
}
