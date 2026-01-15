import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clase } from './entities/clase.entity';
import { WebhookPublisherService } from '../webhooks/webhook-publisher.service';

@Injectable()
export class ClasesService {
  private readonly logger = new Logger(ClasesService.name);

  constructor(
    @InjectRepository(Clase)
    private readonly claseRepository: Repository<Clase>,
    private readonly webhookPublisher: WebhookPublisherService,
  ) {}

  async create(data: Partial<Clase>): Promise<Clase> {
    this.logger.log(`Creating class: ${data.nombre}`);
    
    const clase = this.claseRepository.create(data);
    const saved = await this.claseRepository.save(clase);
    
    this.logger.log(`✅ Class created with ID: ${saved.id}`);

    // Publicar evento de webhook con contexto enriquecido para IA
    await this.webhookPublisher.publishEvent({
      type: 'clase.created',
      data: {
        id: saved.id,
        nombre: saved.nombre,
        instructor: saved.instructor,
        horario: saved.horario,
        cupo: saved.cupo,
        createdAt: saved.createdAt,
        // Contexto adicional para procesamiento IA
        metadata: {
          availability: saved.cupo > 10 ? 'high' : saved.cupo > 5 ? 'medium' : 'low',
          requiresPromotion: saved.cupo > 15,
          isNewInstructor: true, // Podrías verificar esto contra una BD
          scheduleDay: this.extractDayFromSchedule(saved.horario),
          scheduleTime: this.extractTimeFromSchedule(saved.horario),
        },
        // Datos para notificaciones
        notification: {
          title: `🆕 Nueva Clase: ${saved.nombre}`,
          message: `${saved.instructor} - ${saved.horario} - ${saved.cupo} cupos disponibles`,
          priority: 'normal',
          category: 'nueva_clase',
        },
      },
    }).catch(err => {
      this.logger.error(`Failed to publish webhook event: ${err.message}`);
    });
    
    return saved;
  }

  async findAll(): Promise<Clase[]> {
    return this.claseRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Clase> {
    return this.claseRepository.findOne({ where: { id } });
  }

  async updateQuota(id: number, newQuota: number): Promise<Clase> {
    this.logger.log(`Updating quota for class ${id}: ${newQuota}`);
    
    const previousClase = await this.findOne(id);
    await this.claseRepository.update(id, { cupo: newQuota });
    const updated = await this.findOne(id);
    
    this.logger.log(`✅ Quota updated for class ${id}`);

    // Publicar evento de actualización con contexto completo
    await this.webhookPublisher.publishEvent({
      type: 'clase.quota_updated',
      data: {
        id: updated.id,
        nombre: updated.nombre,
        instructor: updated.instructor,
        horario: updated.horario,
        previousQuota: previousClase.cupo,
        currentQuota: updated.cupo,
        quotaDifference: updated.cupo - previousClase.cupo,
        updatedAt: new Date().toISOString(),
      },
    }).catch(err => {
      this.logger.error(`Failed to publish webhook event: ${err.message}`);
    });

    // ⚠️ ALERTA: Verificar si el cupo está bajo
    await this.checkLowQuotaAlert(updated);
    
    return updated;
  }

  async decrementQuota(id: number): Promise<Clase> {
    const clase = await this.findOne(id);
    
    if (!clase) {
      throw new Error(`Class ${id} not found`);
    }

    if (clase.cupo <= 0) {
      throw new Error(`No available spots for class ${id}`);
    }

    const updated = await this.updateQuota(id, clase.cupo - 1);

    // Publicar evento de decremento
    await this.webhookPublisher.publishEvent({
      type: 'clase.enrollment_processed',
      data: {
        id: updated.id,
        nombre: updated.nombre,
        instructor: updated.instructor,
        horario: updated.horario,
        previousQuota: clase.cupo,
        currentQuota: updated.cupo,
        remainingSpots: updated.cupo,
        timestamp: new Date().toISOString(),
      },
    }).catch(err => {
      this.logger.error(`Failed to publish webhook event: ${err.message}`);
    });

    return updated;
  }

  /**
   * Verifica alertas de cupo bajo y emite eventos críticos
   */
  private async checkLowQuotaAlert(clase: Clase): Promise<void> {
    const cupo = clase.cupo;
    let urgencyLevel: 'critical' | 'warning' | 'info' | null = null;
    let message = '';

    // Determinar nivel de urgencia
    if (cupo === 0) {
      urgencyLevel = 'critical';
      message = `⛔ CLASE LLENA: ${clase.nombre} no tiene cupos disponibles`;
    } else if (cupo <= 2) {
      urgencyLevel = 'critical';
      message = `🚨 CUPO CRÍTICO: Solo ${cupo} lugares en ${clase.nombre}`;
    } else if (cupo <= 5) {
      urgencyLevel = 'warning';
      message = `⚠️ CUPO BAJO: Quedan ${cupo} lugares en ${clase.nombre}`;
    } else if (cupo <= 10) {
      urgencyLevel = 'info';
      message = `ℹ️ Atención: ${cupo} lugares disponibles en ${clase.nombre}`;
    }

    // Emitir alerta si es necesario
    if (urgencyLevel) {
      this.logger.warn(message);
      
      await this.webhookPublisher.publishEvent({
        type: 'clase.quota_alert',
        data: {
          urgencyLevel,
          message,
          clase: {
            id: clase.id,
            nombre: clase.nombre,
            instructor: clase.instructor,
            horario: clase.horario,
            cupo: clase.cupo,
          },
          alert: {
            type: urgencyLevel === 'critical' ? 'cupo_critico' : urgencyLevel === 'warning' ? 'cupo_bajo' : 'cupo_moderado',
            threshold: cupo,
            requiresAction: urgencyLevel === 'critical',
            suggestedActions: this.getSuggestedActions(cupo),
          },
          timestamp: new Date().toISOString(),
        },
      }).catch(err => {
        this.logger.error(`Failed to publish alert event: ${err.message}`);
      });
    }
  }

  /**
   * Obtiene acciones sugeridas basadas en el cupo
   */
  private getSuggestedActions(cupo: number): string[] {
    if (cupo === 0) {
      return [
        'Crear lista de espera',
        'Considerar abrir nueva clase',
        'Notificar al administrador',
      ];
    } else if (cupo <= 2) {
      return [
        'Monitorear de cerca',
        'Preparar comunicación de clase llena',
        'Evaluar demanda para clase adicional',
      ];
    } else if (cupo <= 5) {
      return [
        'Informar a usuarios interesados',
        'Promover inscripciones',
      ];
    }
    return ['Seguimiento normal'];
  }

  /**
   * Extrae el día de la semana del horario
   */
  private extractDayFromSchedule(horario: string): string {
    const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    const found = days.find(day => horario.toLowerCase().includes(day));
    return found || 'unknown';
  }

  /**
   * Extrae la hora del horario
   */
  private extractTimeFromSchedule(horario: string): string {
    const timeMatch = horario.match(/(\d{1,2}):(\d{2})/);
    return timeMatch ? timeMatch[0] : 'unknown';
  }
}
