import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from 'src/common/enums';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Usuario creado exitosamente',
    type: User
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'El correo electrónico ya está en uso'
  })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de usuarios obtenida exitosamente',
    type: [User]
  })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener todos los usuarios activos' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de usuarios activos obtenida exitosamente',
    type: [User]
  })
  findActive(): Promise<User[]> {
    return this.userService.findActive();
  }

  @Get('role/:role')
  @ApiOperation({ summary: 'Obtener usuarios por rol' })
  @ApiParam({ name: 'role', description: 'Rol del usuario', enum: UserRole })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de usuarios por rol obtenida exitosamente',
    type: [User]
  })
  findByRole(@Param('role') role: UserRole): Promise<User[]> {
    return this.userService.findByRole(role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuario encontrado',
    type: User
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuario no encontrado'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'ID inválido'
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Obtener un usuario por email' })
  @ApiParam({ name: 'email', description: 'Email del usuario', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuario encontrado',
    type: User
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuario no encontrado'
  })
  findByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.findByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuario actualizado exitosamente',
    type: User
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuario no encontrado'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'El correo electrónico ya está en uso'
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desactivar un usuario (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuario desactivado exitosamente',
    type: User
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuario no encontrado'
  })
  softDelete(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.softDelete(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuario activado exitosamente',
    type: User
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuario no encontrado'
  })
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.activate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario permanentemente' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Usuario eliminado exitosamente'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuario no encontrado'
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
