import { IsString, IsOptional, IsNumber, IsArray, IsBoolean, MinLength, MaxLength, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({
    description: 'Nombre del plan',
    example: 'Plan Premium',
    minLength: 2,
    maxLength: 200
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descripción del plan',
    example: 'Plan completo con acceso a todas las áreas y clases',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string;

  @ApiProperty({
    description: 'Precio del plan',
    example: 49.99,
    minimum: 0
  })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @ApiProperty({
    description: 'Duración del plan en meses',
    example: 12,
    minimum: 1,
    maximum: 60
  })
  @IsNumber({}, { message: 'La duración debe ser un número' })
  @Min(1, { message: 'La duración debe ser al menos 1 mes' })
  @Max(60, { message: 'La duración no puede exceder 60 meses' })
  durationInMonths: number;

  @ApiProperty({
    description: 'Características del plan',
    example: ['Acceso completo al gimnasio', 'Clases grupales ilimitadas', 'Entrenador personal'],
    type: [String],
    required: false
  })
  @IsOptional()
  @IsArray({ message: 'Las características deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada característica debe ser una cadena de texto' })
  features?: string[];

  @ApiProperty({
    description: 'Estado activo del plan',
    example: true,
    default: true,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  isActive?: boolean;
}
