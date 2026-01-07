import { IsString, IsInt, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInscripcionDto {
  @ApiProperty({
    description: 'ID de la clase a la que se inscribe',
    example: 1,
  })
  @IsInt()
  claseId: number;

  @ApiProperty({
    description: 'Nombre completo del alumno',
    example: 'María González',
  })
  @IsString()
  @IsNotEmpty()
  alumno: string;

  @ApiProperty({
    description: 'Email del alumno',
    example: 'maria.gonzalez@example.com',
  })
  @IsEmail()
  email: string;
}
