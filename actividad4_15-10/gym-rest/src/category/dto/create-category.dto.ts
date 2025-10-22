import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Nombre de la categoría',
        example: 'Cardio',
        maxLength: 200
    })
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
    name: string;

    @ApiProperty({
        description: 'Descripción de la categoría',
        example: 'Ejercicios cardiovasculares para mejorar la resistencia',
        required: false
    })
    @IsString({ message: 'La descripción debe ser un texto' })
    @IsOptional()
    description?: string;
}
