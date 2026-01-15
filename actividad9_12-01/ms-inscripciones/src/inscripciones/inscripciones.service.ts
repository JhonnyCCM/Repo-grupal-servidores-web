import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Inscripcion } from './entities/inscripcion.entity';
import { WebhookPublisherService } from '../webhooks/webhook-publisher.service';

@Injectable()
export class InscripcionesService {
  private readonly logger = new Logger(InscripcionesService.name);

  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    private readonly webhookPublisher: WebhookPublisherService,
    private readonly httpService: HttpService,
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

    // Decrementar el cupo de la clase
    try {
      const msClasesUrl = process.env.MS_CLASES_URL || 'http://ms-clases:3003';
      await firstValueFrom(
        this.httpService.post(`${msClasesUrl}/clases/${data.claseId}/decrement-quota`)
      );
      this.logger.log(`✅ Quota decremented for class ${data.claseId}`);
    } catch (error) {
      this.logger.error(`❌ Failed to decrement quota for class ${data.claseId}: ${error.message}`);
      // No lanzamos el error para no interrumpir la inscripción
      // En producción, podrías implementar un mecanismo de compensación
    }

    // Publicar evento de webhook con contexto enriquecido
    await this.webhookPublisher.publishEvent({
      type: 'inscripcion.created',
      data: {
        id: saved.id,
        claseId: saved.claseId,
        alumno: saved.alumno,
        email: saved.email,
        messageId: saved.messageId,
        createdAt: saved.createdAt,
        // Contexto adicional para IA y workflows
        metadata: {
          enrollmentSource: 'api',
          requiresConfirmation: true,
          isFirstEnrollment: true, // Podrías verificar si es la primera inscripción del alumno
          emailDomain: this.extractEmailDomain(saved.email),
        },
        // Datos para notificaciones
        notification: {
          title: `✅ Nueva Inscripción`,
          message: `${saved.alumno} se inscribió en la clase`,
          priority: 'normal',
          category: 'inscripcion',
          recipient: {
            name: saved.alumno,
            email: saved.email,
          },
        },
        // Datos para sincronización (Google Sheets)
        spreadsheet: {
          timestamp: new Date().toISOString(),
          studentName: saved.alumno,
          studentEmail: saved.email,
          classId: saved.claseId,
          enrollmentId: saved.id,
          status: 'confirmed',
        },
      },
      correlationId: messageId,
    }).catch(err => {
      this.logger.error(`Failed to publish webhook event: ${err.message}`);
    });

    return saved;
  }

  async findAll(): Promise<Inscripcion[]> {
    return this.inscripcionRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Extrae el dominio del email
   */
  private extractEmailDomain(email: string): string {
    const parts = email.split('@');
    return parts.length > 1 ? parts[1] : 'unknown';
  }
}
