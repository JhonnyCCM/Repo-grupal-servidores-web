import { IsString, IsEmail, IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, MinLength, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { ISpeciality } from '../../common/enums';

export class CreateCoachDto {
  @ApiProperty({ description: 'Nombre completo del entrenador', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  fullName: string;

  @ApiProperty({ description: 'Email del entrenador', example: 'juan.perez@gym.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Teléfono del entrenador', example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ description: 'Contraseña del entrenador', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Género del entrenador', example: 'Masculino' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  gender: string;

  @ApiProperty({ description: 'Fecha de nacimiento', example: '1990-01-15' })
  @IsDateString()
  birthDate: string;

  @ApiProperty({ description: 'Especialidades del entrenador', type: 'array', items: { type: 'object' } })
  @IsArray()
  @IsNotEmpty()
  specialities: ISpeciality[];

  @ApiProperty({ description: 'Biografía del entrenador', example: 'Entrenador con 5 años de experiencia...' })
  @IsString()
  @IsNotEmpty()
  biography: string;

  @ApiProperty({ description: 'Años de experiencia', example: 5 })
  @IsNumber()
  @IsNotEmpty()
  experienceYears: number;

  @ApiProperty({ description: 'URL de la imagen del entrenador', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @ApiProperty({ description: 'Estado activo del entrenador', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
