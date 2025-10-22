import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentStatus, PaymentMethod } from 'src/common/enums';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pago' })
  @ApiResponse({ 
    status: 201, 
    description: 'Pago creado exitosamente',
    type: Payment 
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pagos' })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    enum: PaymentStatus,
    description: 'Filtrar por estado del pago' 
  })
  @ApiQuery({ 
    name: 'method', 
    required: false, 
    enum: PaymentMethod,
    description: 'Filtrar por método de pago' 
  })
  @ApiQuery({ 
    name: 'userId', 
    required: false, 
    description: 'Filtrar por ID de usuario' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de pagos obtenida exitosamente',
    type: [Payment] 
  })
  findAll(
    @Query('status') status?: PaymentStatus,
    @Query('method') method?: PaymentMethod,
    @Query('userId') userId?: string
  ): Promise<Payment[]> {
    return this.paymentService.findAll(status, method, userId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener pagos de un usuario específico' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pagos del usuario obtenidos exitosamente',
    type: [Payment] 
  })
  findByUser(@Param('userId', ParseUUIDPipe) userId: string): Promise<Payment[]> {
    return this.paymentService.findByUser(userId);
  }

  @Get('membership/:membershipId')
  @ApiOperation({ summary: 'Obtener pagos de una membresía específica' })
  @ApiParam({ name: 'membershipId', description: 'ID de la membresía' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pagos de la membresía obtenidos exitosamente',
    type: [Payment] 
  })
  findByMembership(@Param('membershipId', ParseUUIDPipe) membershipId: string): Promise<Payment[]> {
    return this.paymentService.findByMembership(membershipId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Obtener pagos por estado' })
  @ApiParam({ name: 'status', enum: PaymentStatus, description: 'Estado del pago' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pagos filtrados por estado',
    type: [Payment] 
  })
  findByStatus(@Param('status') status: PaymentStatus): Promise<Payment[]> {
    return this.paymentService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pago por ID' })
  @ApiParam({ name: 'id', description: 'ID del pago' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pago encontrado',
    type: Payment 
  })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Payment> {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un pago' })
  @ApiParam({ name: 'id', description: 'ID del pago' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pago actualizado exitosamente',
    type: Payment 
  })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updatePaymentDto: UpdatePaymentDto
  ): Promise<Payment> {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Marcar pago como completado' })
  @ApiParam({ name: 'id', description: 'ID del pago' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pago marcado como completado',
    type: Payment 
  })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  markAsCompleted(@Param('id', ParseUUIDPipe) id: string): Promise<Payment> {
    return this.paymentService.markAsCompleted(id);
  }

  @Patch(':id/fail')
  @ApiOperation({ summary: 'Marcar pago como fallido' })
  @ApiParam({ name: 'id', description: 'ID del pago' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pago marcado como fallido',
    type: Payment 
  })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  markAsFailed(@Param('id', ParseUUIDPipe) id: string): Promise<Payment> {
    return this.paymentService.markAsFailed(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un pago' })
  @ApiParam({ name: 'id', description: 'ID del pago' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pago eliminado exitosamente' 
  })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.paymentService.remove(id);
  }
}
