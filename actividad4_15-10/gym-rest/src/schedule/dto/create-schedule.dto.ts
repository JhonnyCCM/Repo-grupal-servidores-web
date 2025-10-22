import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class CreateScheduleDto {
    @ApiProperty({
        description: 'Nombre del horario',
        example: 'Horario Matutino',
        maxLength: 200
    })
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
    name: string;

    @ApiProperty({
        description: 'Hora de inicio en formato HH:MM',
        example: '08:00'
    })
    @IsString({ message: 'La hora de inicio debe ser un texto' })
    @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { 
        message: 'La hora de inicio debe tener formato HH:MM (24h)' 
    })
    startTime: string;

    @ApiProperty({
        description: 'Hora de fin en formato HH:MM',
        example: '10:00'
    })
    @IsString({ message: 'La hora de fin debe ser un texto' })
    @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { 
        message: 'La hora de fin debe tener formato HH:MM (24h)' 
    })
    endTime: string;
}
