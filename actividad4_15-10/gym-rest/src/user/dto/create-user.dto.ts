import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'María',
    minLength: 2,
    maxLength: 100
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'García',
    minLength: 2,
    maxLength: 100
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
  lastName: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'maria.garcia@email.com'
  })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123!',
    minLength: 8
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiProperty({
    description: 'URL de la imagen del usuario',
    example: 'https://example.com/user-photo.jpg',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La URL de la imagen debe ser una cadena de texto' })
  imageUrl?: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER,
    required: false
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser uno de los valores válidos: admin, user, coach' })
  role?: UserRole;

  @ApiProperty({
    description: 'Estado activo del usuario',
    example: true,
    default: true,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  isActive?: boolean;
}
