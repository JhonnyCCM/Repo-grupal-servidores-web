import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateClassEnrollmentDto } from './dto/create-class_enrollment.dto';
import { UpdateClassEnrollmentDto } from './dto/update-class_enrollment.dto';
import { ClassEnrollment } from './entities/class_enrollment.entity';

@Injectable()
export class ClassEnrollmentService {
  constructor(
    @InjectRepository(ClassEnrollment)
    private readonly classEnrollmentRepository: Repository<ClassEnrollment>,
  ) {}

  async create(createClassEnrollmentDto: CreateClassEnrollmentDto): Promise<ClassEnrollment> {
    try {
      // Verificar si ya existe una inscripción del usuario en esta clase
      const existing = await this.classEnrollmentRepository.findOne({
        where: {
          userId: createClassEnrollmentDto.userId,
          classId: createClassEnrollmentDto.classId
        }
      });

      if (existing) {
        throw new ConflictException('El usuario ya está inscrito en esta clase');
      }

      const enrollmentDate = createClassEnrollmentDto.enrollmentDate || new Date().toISOString().split('T')[0];
      
      const classEnrollment = this.classEnrollmentRepository.create({
        ...createClassEnrollmentDto,
        enrollmentDate: new Date(enrollmentDate)
      });
      
      return await this.classEnrollmentRepository.save(classEnrollment);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al crear la inscripción');
    }
  }

  async findAll(
    userId?: string, 
    classId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<ClassEnrollment[]> {
    try {
      const queryBuilder = this.classEnrollmentRepository.createQueryBuilder('enrollment');

      if (userId) {
        queryBuilder.where('enrollment.userId = :userId', { userId });
      }

      if (classId) {
        queryBuilder.andWhere('enrollment.classId = :classId', { classId });
      }

      if (startDate && endDate) {
        queryBuilder.andWhere('enrollment.enrollmentDate BETWEEN :startDate AND :endDate', {
          startDate,
          endDate
        });
      } else if (startDate) {
        queryBuilder.andWhere('enrollment.enrollmentDate >= :startDate', { startDate });
      } else if (endDate) {
        queryBuilder.andWhere('enrollment.enrollmentDate <= :endDate', { endDate });
      }

      queryBuilder.orderBy('enrollment.enrollmentDate', 'DESC');
      return await queryBuilder.getMany();
    } catch (error) {
      throw new BadRequestException('Error al obtener las inscripciones');
    }
  }

  async findOne(id: string): Promise<ClassEnrollment> {
    try {
      const classEnrollment = await this.classEnrollmentRepository.findOne({ where: { id } });
      
      if (!classEnrollment) {
        throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
      }

      return classEnrollment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener la inscripción');
    }
  }

  async update(id: string, updateClassEnrollmentDto: UpdateClassEnrollmentDto): Promise<ClassEnrollment> {
    try {
      const classEnrollment = await this.findOne(id);

      // Si se está actualizando usuario o clase, verificar que no exista otra inscripción igual
      if (updateClassEnrollmentDto.userId || updateClassEnrollmentDto.classId) {
        const userId = updateClassEnrollmentDto.userId || classEnrollment.userId;
        const classId = updateClassEnrollmentDto.classId || classEnrollment.classId;

        const existing = await this.classEnrollmentRepository.findOne({
          where: { userId, classId }
        });

        if (existing && existing.id !== id) {
          throw new ConflictException('El usuario ya está inscrito en esta clase');
        }
      }

      // Si se proporciona enrollmentDate como string, convertirla a Date
      if (updateClassEnrollmentDto.enrollmentDate) {
        updateClassEnrollmentDto.enrollmentDate = new Date(updateClassEnrollmentDto.enrollmentDate) as any;
      }

      Object.assign(classEnrollment, updateClassEnrollmentDto);
      return await this.classEnrollmentRepository.save(classEnrollment);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar la inscripción');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const classEnrollment = await this.findOne(id);
      await this.classEnrollmentRepository.remove(classEnrollment);
      return { message: `Inscripción con ID ${id} eliminada correctamente` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar la inscripción');
    }
  }

  async findByUser(userId: string): Promise<ClassEnrollment[]> {
    try {
      return await this.classEnrollmentRepository.find({
        where: { userId },
        order: { enrollmentDate: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener inscripciones del usuario');
    }
  }

  async findByClass(classId: string): Promise<ClassEnrollment[]> {
    try {
      return await this.classEnrollmentRepository.find({
        where: { classId },
        order: { enrollmentDate: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener inscripciones de la clase');
    }
  }

  async removeByUserAndClass(userId: string, classId: string): Promise<{ message: string }> {
    try {
      const enrollment = await this.classEnrollmentRepository.findOne({
        where: { userId, classId }
      });

      if (!enrollment) {
        throw new NotFoundException('No existe inscripción para este usuario en esta clase');
      }

      await this.classEnrollmentRepository.remove(enrollment);
      return { message: 'Inscripción eliminada correctamente' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar la inscripción');
    }
  }

  async getEnrollmentsByDateRange(startDate: Date, endDate: Date): Promise<ClassEnrollment[]> {
    try {
      return await this.classEnrollmentRepository.find({
        where: {
          enrollmentDate: Between(startDate, endDate)
        },
        order: { enrollmentDate: 'DESC' }
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener inscripciones por rango de fechas');
    }
  }

  async getEnrollmentCount(classId: string): Promise<number> {
    try {
      return await this.classEnrollmentRepository.count({
        where: { classId }
      });
    } catch (error) {
      throw new BadRequestException('Error al contar inscripciones de la clase');
    }
  }
}
