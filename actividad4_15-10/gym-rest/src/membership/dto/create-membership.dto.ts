import { IsUUID, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MembershipStatus } from 'src/common/enums';

export class CreateMembershipDto {
  @ApiProperty({
    description: 'ID del usuario propietario de la membresía',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  userId: string;

  @ApiProperty({
    description: 'ID del plan de la membresía',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID('4', { message: 'El ID del plan debe ser un UUID válido' })
  planId: string;

  @ApiProperty({
    description: 'Estado de la membresía',
    enum: MembershipStatus,
    example: MembershipStatus.ACTIVE,
    default: MembershipStatus.ACTIVE,
    required: false
  })
  @IsOptional()
  @IsEnum(MembershipStatus, { message: 'El estado debe ser uno de los valores válidos: Activa, Inactiva, Expirada' })
  status?: MembershipStatus;

  @ApiProperty({
    description: 'Fecha de inicio de la membresía',
    example: '2024-01-01',
    type: 'string',
    format: 'date'
  })
  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida en formato YYYY-MM-DD' })
  startDate: string;

  @ApiProperty({
    description: 'Fecha de fin de la membresía',
    example: '2024-12-31',
    type: 'string',
    format: 'date'
  })
  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida en formato YYYY-MM-DD' })
  endDate: string;
}
