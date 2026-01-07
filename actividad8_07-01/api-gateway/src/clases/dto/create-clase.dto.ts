import { IsString, IsInt, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClaseDto {
  @ApiProperty({
    description: 'Nombre de la clase',
    example: 'Yoga Avanzado',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'Horario de la clase',
    example: 'Lunes y Miércoles 18:00-19:00',
  })
  @IsString()
  @IsNotEmpty()
  horario: string;

  @ApiProperty({
    description: 'Cupo disponible para la clase',
    example: 20,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  cupo: number;

  @ApiProperty({
    description: 'Nombre del instructor',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  instructor: string;
}
