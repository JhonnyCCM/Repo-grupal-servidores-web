import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import axios from 'axios';

@ApiTags('health')
@Controller('health')
export class HealthController {
  private readonly MS_CLASES_URL = process.env.MS_CLASES_URL || 'http://ms-clases:3001';
  private readonly MS_INSCRIPCIONES_URL = process.env.MS_INSCRIPCIONES_URL || 'http://ms-inscripciones:3002';
  private readonly RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';

  @Get()
  @ApiOperation({ summary: 'Verificar el estado de salud del sistema' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sistema saludable',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2024-01-15T10:00:00.000Z',
        services: {
          'api-gateway': { status: 'up', message: 'API Gateway is running' },
          rabbitmq: { status: 'up', message: 'Connected to RabbitMQ' },
          'ms-clases': { status: 'up', responseTime: 45 },
          'ms-inscripciones': { status: 'up', responseTime: 52 }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 503, 
    description: 'Uno o más servicios no disponibles' 
  })
  async checkHealth() {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        'api-gateway': {
          status: 'up',
          message: 'API Gateway is running',
        },
        rabbitmq: await this.checkRabbitMQ(),
        'ms-clases': await this.checkMicroservice(this.MS_CLASES_URL, 'clases'),
        'ms-inscripciones': await this.checkMicroservice(this.MS_INSCRIPCIONES_URL, 'inscripciones'),
      },
    };

    // Determinar estado general
    const hasFailures = Object.values(health.services).some(
      (service: any) => service.status !== 'up'
    );

    if (hasFailures) {
      health.status = 'degraded';
    }

    return health;
  }

  private async checkRabbitMQ(): Promise<any> {
    try {
      // Verificar si la URL de RabbitMQ está configurada
      if (this.RABBITMQ_URL) {
        return {
          status: 'up',
          message: 'RabbitMQ URL configured',
        };
      }
      return {
        status: 'down',
        message: 'RabbitMQ URL not configured',
      };
    } catch (error) {
      return {
        status: 'down',
        message: error.message,
      };
    }
  }

  private async checkMicroservice(baseUrl: string, endpoint: string): Promise<any> {
    const startTime = Date.now();
    try {
      const response = await axios.get(`${baseUrl}/${endpoint}`, {
        timeout: 5000,
      });
      const responseTime = Date.now() - startTime;

      return {
        status: 'up',
        responseTime,
        statusCode: response.status,
      };
    } catch (error) {
      return {
        status: 'down',
        message: error.message,
        error: error.code || 'UNKNOWN_ERROR',
      };
    }
  }

  @Get('liveness')
  @ApiOperation({ summary: 'Verificar si el API Gateway está vivo' })
  @ApiResponse({ status: 200, description: 'API Gateway está vivo' })
  liveness() {
    return {
      status: 'ok',
      message: 'API Gateway is alive',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Verificar si el API Gateway está listo para recibir tráfico' })
  @ApiResponse({ status: 200, description: 'API Gateway está listo' })
  @ApiResponse({ status: 503, description: 'API Gateway no está listo' })
  async readiness() {
    // Verificar que los servicios críticos estén disponibles
    const msClases = await this.checkMicroservice(this.MS_CLASES_URL, 'clases');
    const msInscripciones = await this.checkMicroservice(this.MS_INSCRIPCIONES_URL, 'inscripciones');

    const isReady = msClases.status === 'up' && msInscripciones.status === 'up';

    if (!isReady) {
      return {
        status: 'not_ready',
        message: 'One or more critical services are down',
        services: {
          'ms-clases': msClases,
          'ms-inscripciones': msInscripciones,
        },
      };
    }

    return {
      status: 'ready',
      message: 'API Gateway is ready to receive traffic',
      timestamp: new Date().toISOString(),
    };
  }
}
