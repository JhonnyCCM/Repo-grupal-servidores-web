import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateClassEnrollmentDto {
    @ApiProperty({
        description: 'Fecha de inscripción',
        example: '2023-10-21',
        required: false,
        default: 'Fecha actual'
    })
    @IsDateString({}, { message: 'La fecha de inscripción debe ser una fecha válida' })
    @IsOptional()
    @Transform(({ value }) => value || new Date().toISOString().split('T')[0])
    enrollmentDate?: string;

    @ApiProperty({
        description: 'ID del usuario que se inscribe',
        example: 'uuid-user-id'
    })
    @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    userId: string;

    @ApiProperty({
        description: 'ID de la clase a la que se inscribe',
        example: 'uuid-class-id'
    })
    @IsUUID('4', { message: 'El ID de la clase debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID de la clase es obligatorio' })
    classId: string;
}
