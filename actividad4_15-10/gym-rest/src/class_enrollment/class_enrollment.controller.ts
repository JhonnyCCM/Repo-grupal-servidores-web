import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ClassEnrollmentService } from './class_enrollment.service';
import { CreateClassEnrollmentDto } from './dto/create-class_enrollment.dto';
import { UpdateClassEnrollmentDto } from './dto/update-class_enrollment.dto';
import { ClassEnrollment } from './entities/class_enrollment.entity';

@ApiTags('class-enrollments')
@Controller('class-enrollments')
export class ClassEnrollmentController {
  constructor(private readonly classEnrollmentService: ClassEnrollmentService) {}

  @Post()
  @ApiOperation({ summary: 'Inscribir un usuario a una clase' })
  @ApiResponse({ 
    status: 201, 
    description: 'Inscripción creada exitosamente',
    type: ClassEnrollment 
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El usuario ya está inscrito en esta clase' })
  create(@Body() createClassEnrollmentDto: CreateClassEnrollmentDto): Promise<ClassEnrollment> {
    return this.classEnrollmentService.create(createClassEnrollmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las inscripciones' })
  @ApiQuery({ 
    name: 'userId', 
    required: false, 
    description: 'Filtrar por ID de usuario' 
  })
  @ApiQuery({ 
    name: 'classId', 
    required: false, 
    description: 'Filtrar por ID de clase' 
  })
  @ApiQuery({ 
    name: 'startDate', 
    required: false, 
    description: 'Fecha de inicio (YYYY-MM-DD)' 
  })
  @ApiQuery({ 
    name: 'endDate', 
    required: false, 
    description: 'Fecha de fin (YYYY-MM-DD)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de inscripciones obtenida exitosamente',
    type: [ClassEnrollment] 
  })
  findAll(
    @Query('userId') userId?: string,
    @Query('classId') classId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<ClassEnrollment[]> {
    return this.classEnrollmentService.findAll(userId, classId, startDate, endDate);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener inscripciones de un usuario específico' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Inscripciones del usuario obtenidas exitosamente',
    type: [ClassEnrollment] 
  })
  findByUser(@Param('userId', ParseUUIDPipe) userId: string): Promise<ClassEnrollment[]> {
    return this.classEnrollmentService.findByUser(userId);
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Obtener inscripciones de una clase específica' })
  @ApiParam({ name: 'classId', description: 'ID de la clase' })
  @ApiResponse({ 
    status: 200, 
    description: 'Inscripciones de la clase obtenidas exitosamente',
    type: [ClassEnrollment] 
  })
  findByClass(@Param('classId', ParseUUIDPipe) classId: string): Promise<ClassEnrollment[]> {
    return this.classEnrollmentService.findByClass(classId);
  }

  @Get('class/:classId/count')
  @ApiOperation({ summary: 'Obtener número de inscripciones de una clase' })
  @ApiParam({ name: 'classId', description: 'ID de la clase' })
  @ApiResponse({ 
    status: 200, 
    description: 'Número de inscripciones obtenido exitosamente',
    schema: { 
      type: 'object',
      properties: {
        count: { type: 'number', example: 15 }
      }
    }
  })
  async getEnrollmentCount(@Param('classId', ParseUUIDPipe) classId: string): Promise<{ count: number }> {
    const count = await this.classEnrollmentService.getEnrollmentCount(classId);
    return { count };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una inscripción por ID' })
  @ApiParam({ name: 'id', description: 'ID de la inscripción' })
  @ApiResponse({ 
    status: 200, 
    description: 'Inscripción encontrada',
    type: ClassEnrollment 
  })
  @ApiResponse({ status: 404, description: 'Inscripción no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ClassEnrollment> {
    return this.classEnrollmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una inscripción' })
  @ApiParam({ name: 'id', description: 'ID de la inscripción' })
  @ApiResponse({ 
    status: 200, 
    description: 'Inscripción actualizada exitosamente',
    type: ClassEnrollment 
  })
  @ApiResponse({ status: 404, description: 'Inscripción no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El usuario ya está inscrito en esta clase' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateClassEnrollmentDto: UpdateClassEnrollmentDto
  ): Promise<ClassEnrollment> {
    return this.classEnrollmentService.update(id, updateClassEnrollmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una inscripción' })
  @ApiParam({ name: 'id', description: 'ID de la inscripción' })
  @ApiResponse({ 
    status: 200, 
    description: 'Inscripción eliminada exitosamente' 
  })
  @ApiResponse({ status: 404, description: 'Inscripción no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.classEnrollmentService.remove(id);
  }

  @Delete('user/:userId/class/:classId')
  @ApiOperation({ summary: 'Eliminar inscripción por usuario y clase' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiParam({ name: 'classId', description: 'ID de la clase' })
  @ApiResponse({ 
    status: 200, 
    description: 'Inscripción eliminada exitosamente' 
  })
  @ApiResponse({ status: 404, description: 'Inscripción no encontrada' })
  removeByUserAndClass(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('classId', ParseUUIDPipe) classId: string
  ): Promise<{ message: string }> {
    return this.classEnrollmentService.removeByUserAndClass(userId, classId);
  }
}
