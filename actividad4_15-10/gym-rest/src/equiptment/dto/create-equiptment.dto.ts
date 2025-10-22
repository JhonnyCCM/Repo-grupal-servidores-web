import { IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/common/enums';

export class CreateEquiptmentDto {
  @ApiProperty({
    description: 'Nombre del equipo',
    example: 'Cinta de correr profesional',
    minLength: 2,
    maxLength: 200
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descripción del equipo',
    example: 'Cinta de correr con pantalla táctil y programas predefinidos',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string;

  @ApiProperty({
    description: 'Estado del equipo',
    enum: Status,
    example: Status.ACTIVE,
    default: Status.ACTIVE,
    required: false
  })
  @IsOptional()
  @IsEnum(Status, { message: 'El estado debe ser uno de los valores válidos: Disponible, No disponible, En mantenimiento' })
  status?: Status;

  @ApiProperty({
    description: 'URL de la imagen del equipo',
    example: 'https://example.com/equipment-photo.jpg',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La URL de la imagen debe ser una cadena de texto' })
  imageUrl?: string;
}
