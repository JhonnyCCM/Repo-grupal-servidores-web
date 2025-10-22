import { IsString, IsOptional, IsEnum, IsUUID, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DifficultyLevel } from 'src/common/enums';

export class CreateGymClassDto {
  @ApiProperty({
    description: 'Nombre de la clase de gimnasio',
    example: 'Yoga para principiantes',
    minLength: 2,
    maxLength: 200
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descripción de la clase',
    example: 'Clase de yoga diseñada especialmente para principiantes...',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string;

  @ApiProperty({
    description: 'ID del entrenador asignado a la clase',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID('4', { message: 'El ID del entrenador debe ser un UUID válido' })
  coachId: string;

  @ApiProperty({
    description: 'Nivel de dificultad de la clase',
    enum: DifficultyLevel,
    example: DifficultyLevel.BEGINNER,
    default: DifficultyLevel.BEGINNER,
    required: false
  })
  @IsOptional()
  @IsEnum(DifficultyLevel, { message: 'El nivel de dificultad debe ser uno de los valores válidos: Principiante, Intermedio, Avanzado' })
  difficultyLevel?: DifficultyLevel;

  @ApiProperty({
    description: 'URL de la imagen de la clase',
    example: 'https://example.com/class-photo.jpg',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La URL de la imagen debe ser una cadena de texto' })
  imageUrl?: string;

  @ApiProperty({
    description: 'ID del horario asignado a la clase',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del horario debe ser un UUID válido' })
  scheduleId?: string;

  @ApiProperty({
    description: 'ID del salón asignado a la clase',
    example: '123e4567-e89b-12d3-a456-426614174002',
    required: false
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del salón debe ser un UUID válido' })
  roomId?: string;

  @ApiProperty({
    description: 'Estado activo de la clase',
    example: true,
    default: true,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  isActive?: boolean;
}
