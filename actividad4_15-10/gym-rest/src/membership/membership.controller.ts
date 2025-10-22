import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './entities/membership.entity';
import { MembershipStatus } from 'src/common/enums';

@ApiTags('memberships')
@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva membresía' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Membresía creada exitosamente',
    type: Membership
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos'
  })
  create(@Body() createMembershipDto: CreateMembershipDto): Promise<Membership> {
    return this.membershipService.create(createMembershipDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las membresías' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de membresías obtenida exitosamente',
    type: [Membership]
  })
  findAll(): Promise<Membership[]> {
    return this.membershipService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener todas las membresías activas' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de membresías activas obtenida exitosamente',
    type: [Membership]
  })
  findActive(): Promise<Membership[]> {
    return this.membershipService.findActive();
  }

  @Get('expired')
  @ApiOperation({ summary: 'Obtener todas las membresías expiradas' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de membresías expiradas obtenida exitosamente',
    type: [Membership]
  })
  findExpired(): Promise<Membership[]> {
    return this.membershipService.findExpired();
  }

  @Get('expiring/:days')
  @ApiOperation({ summary: 'Obtener membresías próximas a expirar' })
  @ApiParam({ name: 'days', description: 'Días para expirar', type: 'number' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de membresías próximas a expirar obtenida exitosamente',
    type: [Membership]
  })
  findExpiring(@Param('days', ParseIntPipe) days: number): Promise<Membership[]> {
    return this.membershipService.findExpiring(days);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener membresías por usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de membresías del usuario obtenida exitosamente',
    type: [Membership]
  })
  findByUser(@Param('userId', ParseUUIDPipe) userId: string): Promise<Membership[]> {
    return this.membershipService.findByUser(userId);
  }

  @Get('plan/:planId')
  @ApiOperation({ summary: 'Obtener membresías por plan' })
  @ApiParam({ name: 'planId', description: 'ID del plan', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de membresías del plan obtenida exitosamente',
    type: [Membership]
  })
  findByPlan(@Param('planId', ParseUUIDPipe) planId: string): Promise<Membership[]> {
    return this.membershipService.findByPlan(planId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Obtener membresías por estado' })
  @ApiParam({ name: 'status', description: 'Estado de la membresía', enum: MembershipStatus })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de membresías por estado obtenida exitosamente',
    type: [Membership]
  })
  findByStatus(@Param('status') status: MembershipStatus): Promise<Membership[]> {
    return this.membershipService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una membresía por ID' })
  @ApiParam({ name: 'id', description: 'ID de la membresía', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Membresía encontrada',
    type: Membership
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Membresía no encontrada'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'ID inválido'
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Membership> {
    return this.membershipService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una membresía' })
  @ApiParam({ name: 'id', description: 'ID de la membresía', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Membresía actualizada exitosamente',
    type: Membership
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Membresía no encontrada'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos'
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateMembershipDto: UpdateMembershipDto): Promise<Membership> {
    return this.membershipService.update(id, updateMembershipDto);
  }

  @Patch(':id/expire')
  @ApiOperation({ summary: 'Expirar una membresía' })
  @ApiParam({ name: 'id', description: 'ID de la membresía', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Membresía expirada exitosamente',
    type: Membership
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Membresía no encontrada'
  })
  expire(@Param('id', ParseUUIDPipe) id: string): Promise<Membership> {
    return this.membershipService.expire(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activar una membresía' })
  @ApiParam({ name: 'id', description: 'ID de la membresía', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Membresía activada exitosamente',
    type: Membership
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Membresía no encontrada'
  })
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<Membership> {
    return this.membershipService.activate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una membresía permanentemente' })
  @ApiParam({ name: 'id', description: 'ID de la membresía', type: 'string' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Membresía eliminada exitosamente'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Membresía no encontrada'
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.membershipService.remove(id);
  }
}
