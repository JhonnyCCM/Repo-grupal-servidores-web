import { IsString, IsArray, IsEnum, IsBoolean, IsNumber, IsOptional, IsNotEmpty, IsUUID, MinLength, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DifficultyLevel } from '../../common/enums';
import type { ICategory, IRoom, IScheduleItem } from '../../common/enums';

export class CreateGymClassDto {
  @ApiProperty({ description: 'Nombre de la clase', example: 'Yoga Matutino' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Descripción de la clase', example: 'Clase de yoga relajante para comenzar el día...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ 
    description: 'Categoría de la clase',
    example: { id: '1', name: 'Fitness', description: 'Clases de ejercicio físico' }
  })
  @IsNotEmpty()
  category: ICategory;

  @ApiProperty({ description: 'Capacidad máxima de la clase', example: 20 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  capacity: number;

  @ApiProperty({ 
    description: 'Sala donde se realiza la clase',
    example: { id: '1', name: 'Sala A', description: 'Sala principal', location: 'Piso 1', capacity: 30 }
  })
  @IsNotEmpty()
  room: IRoom;

  @ApiProperty({ description: 'Nivel de dificultad de la clase', enum: DifficultyLevel })
  @IsEnum(DifficultyLevel)
  @IsNotEmpty()
  difficultyLevel: DifficultyLevel;

  @ApiProperty({ 
    description: 'Horarios de la clase',
    example: [{ day: 'Lunes', startTime: '08:00', endTime: '09:00' }]
  })
  @IsArray()
  @IsNotEmpty()
  schedule: IScheduleItem[];

  @ApiProperty({ description: 'ID del entrenador asignado' })
  @IsUUID()
  @IsNotEmpty()
  coachId: string;

  @ApiProperty({ description: 'URL de la imagen de la clase', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @ApiProperty({ description: 'Estado activo de la clase', default: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = false;
}
