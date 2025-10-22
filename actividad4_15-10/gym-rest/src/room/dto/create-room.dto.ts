import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export class CreateRoomDto {
    @ApiProperty({
        description: 'Nombre de la sala',
        example: 'Sala de Yoga',
        maxLength: 200
    })
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
    name: string;

    @ApiProperty({
        description: 'Descripción de la sala',
        example: 'Sala equipada para clases de yoga y pilates',
        required: false
    })
    @IsString({ message: 'La descripción debe ser un texto' })
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Capacidad máxima de personas en la sala',
        example: 25,
        minimum: 1
    })
    @IsInt({ message: 'La capacidad debe ser un número entero' })
    @Min(1, { message: 'La capacidad debe ser mayor a 0' })
    capacity: number;
}
