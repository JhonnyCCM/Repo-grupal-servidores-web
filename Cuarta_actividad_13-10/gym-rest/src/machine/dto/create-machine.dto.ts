import { IsString, IsArray, IsEnum, IsOptional, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../common/enums';
import type { IRoom, ISpeciality } from '../../common/enums';

export class CreateMachineDto {
  @ApiProperty({ description: 'Nombre de la máquina', example: 'Cinta de correr profesional' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Descripción de la máquina', example: 'Cinta de correr de alta calidad para cardio...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Especialidades de la máquina', type: 'array', items: { type: 'object' } })
  @IsArray()
  @IsNotEmpty()
  specialities: ISpeciality[];

  @ApiProperty({ description: 'Salas donde está ubicada la máquina', type: 'array', items: { type: 'object' } })
  @IsArray()
  @IsNotEmpty()
  room: IRoom[];

  @ApiProperty({ description: 'Estado de la máquina', enum: Status, default: Status.ACTIVE })
  @IsEnum(Status)
  @IsOptional()
  status?: Status = Status.ACTIVE;

  @ApiProperty({ description: 'URL de la imagen de la máquina', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;
}
