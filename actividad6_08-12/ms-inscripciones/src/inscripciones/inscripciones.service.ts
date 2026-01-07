import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion } from './entities/inscripcion.entity';

@Injectable()
export class InscripcionesService {
  private readonly logger = new Logger(InscripcionesService.name);

  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
  ) {}

  async create(messageId: string, data: Partial<Inscripcion>): Promise<Inscripcion> {
    this.logger.log(`Creating enrollment for class ${data.claseId} | MessageID: ${messageId}`);
    
    // Validación básica
    if (!data.claseId || !data.alumno || !data.email) {
      throw new BadRequestException('Missing required fields');
    }

    // Crear inscripción
    const inscripcion = this.inscripcionRepository.create({
      ...data,
      messageId,
    });

    const saved = await this.inscripcionRepository.save(inscripcion);
    this.logger.log(`✅ Enrollment created with ID: ${saved.id}`);

    return saved;
  }

  async findAll(): Promise<Inscripcion[]> {
    return this.inscripcionRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
