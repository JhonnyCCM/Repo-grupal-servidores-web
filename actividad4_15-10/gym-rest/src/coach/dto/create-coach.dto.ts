import { IsString, IsEmail, IsOptional, IsNumber, IsArray, IsBoolean, MinLength, MaxLength, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCoachDto {
  @ApiProperty({
    description: 'Nombre del entrenador',
    example: 'Juan',
    minLength: 2,
    maxLength: 100
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del entrenador',
    example: 'Pérez',
    minLength: 2,
    maxLength: 100
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
  lastName: string;

  @ApiProperty({
    description: 'Correo electrónico del entrenador',
    example: 'juan.perez@gym.com'
  })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del entrenador',
    example: 'Password123!',
    minLength: 8
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Biografía del entrenador',
    example: 'Entrenador certificado con 5 años de experiencia...',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La biografía debe ser una cadena de texto' })
  biography?: string;

  @ApiProperty({
    description: 'Años de experiencia del entrenador',
    example: 5,
    minimum: 0,
    maximum: 50
  })
  @IsNumber({}, { message: 'Los años de experiencia deben ser un número' })
  @Min(0, { message: 'Los años de experiencia no pueden ser negativos' })
  @Max(50, { message: 'Los años de experiencia no pueden exceder 50' })
  experienceYears: number;

  @ApiProperty({
    description: 'URL de la imagen del entrenador',
    example: 'https://example.com/coach-photo.jpg',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La URL de la imagen debe ser una cadena de texto' })
  imageUrl?: string;

  @ApiProperty({
    description: 'Especialidades del entrenador',
    example: ['Crossfit', 'Yoga', 'Pilates'],
    type: [String],
    required: false
  })
  @IsOptional()
  @IsArray({ message: 'Las especialidades deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada especialidad debe ser una cadena de texto' })
  specialities?: string[];

  @ApiProperty({
    description: 'Estado activo del entrenador',
    example: true,
    default: true,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  isActive?: boolean;
}
