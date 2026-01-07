/**
 * AI Controller
 * Controlador para el endpoint de procesamiento inteligente con Gemini
 * Este es el punto de entrada para las solicitudes de lenguaje natural
 */

import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GeminiService, ProcessResult } from '../gemini/gemini.service';
import { ProcesarSolicitudDto, RespuestaProcesadaDto } from './dto/procesar-solicitud.dto';

@Controller('api')
export class AiController {
  constructor(private readonly geminiService: GeminiService) {}

  /**
   * POST /api/procesar
   * Procesa una solicitud en lenguaje natural y ejecuta las Tools necesarias
   * 
   * @example
   * POST /api/procesar
   * {
   *   "mensaje": "Quiero inscribirme en la clase de Yoga"
   * }
   */
  @Post('procesar')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async procesarSolicitud(
    @Body() dto: ProcesarSolicitudDto,
  ): Promise<RespuestaProcesadaDto> {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║            🤖 NUEVA SOLICITUD DE IA                        ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  📝 Mensaje: ${dto.mensaje.substring(0, 45).padEnd(45)}║`);
    console.log('╚════════════════════════════════════════════════════════════╝');

    const startTime = Date.now();

    try {
      // Construir mensaje completo con contexto opcional
      let mensajeCompleto = dto.mensaje;
      if (dto.contexto) {
        mensajeCompleto = `Contexto: ${dto.contexto}\n\nSolicitud: ${dto.mensaje}`;
      }

      // Procesar con Gemini
      const result: ProcessResult = await this.geminiService.processUserRequest(mensajeCompleto);

      const tiempoProcesamiento = Date.now() - startTime;

      return {
        success: result.success,
        respuesta: result.response,
        toolsEjecutadas: result.toolsExecuted.map(tool => ({
          nombre: tool.name,
          argumentos: tool.args,
          resultado: tool.result,
        })),
        tiempoProcesamiento,
        error: result.error,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ Error en procesamiento:', errorMessage);

      return {
        success: false,
        respuesta: `Error procesando la solicitud: ${errorMessage}`,
        toolsEjecutadas: [],
        tiempoProcesamiento: Date.now() - startTime,
        error: errorMessage,
      };
    }
  }

  /**
   * GET /api/status
   * Obtiene el estado del servicio de IA
   */
  @Get('status')
  getStatus() {
    const geminiStatus = this.geminiService.getStatus();
    
    return {
      service: 'ai-gateway',
      timestamp: new Date().toISOString(),
      gemini: {
        disponible: geminiStatus.initialized,
        modelo: geminiStatus.model,
        toolsDisponibles: geminiStatus.toolsCount,
      },
      endpoints: {
        procesar: 'POST /api/procesar',
        status: 'GET /api/status',
        tools: 'GET /api/tools',
      },
    };
  }

  /**
   * GET /api/tools
   * Lista las tools disponibles para el procesamiento
   */
  @Get('tools')
  async getTools() {
    const status = this.geminiService.getStatus();
    
    return {
      disponible: status.initialized,
      modelo: status.model,
      tools: [
        {
          nombre: 'buscar_clase',
          tipo: 'Búsqueda',
          descripcion: 'Busca clases del gimnasio por nombre, instructor u horario',
          parametros: ['nombre', 'instructor', 'horario'],
        },
        {
          nombre: 'validar_cupo',
          tipo: 'Validación',
          descripcion: 'Verifica si hay cupo disponible en una clase',
          parametros: ['clase_id', 'nombre_clase'],
        },
        {
          nombre: 'inscribir_alumno',
          tipo: 'Acción',
          descripcion: 'Registra la inscripción de un alumno a una clase',
          parametros: ['clase_id', 'nombre_alumno', 'email'],
        },
      ],
      ejemplos: [
        {
          solicitud: 'Buscar clases de yoga',
          descripcion: 'Gemini ejecutará buscar_clase con nombre="yoga"',
        },
        {
          solicitud: 'Quiero inscribirme en spinning, mi nombre es Juan y mi email es juan@email.com',
          descripcion: 'Gemini ejecutará buscar_clase, validar_cupo y inscribir_alumno secuencialmente',
        },
        {
          solicitud: '¿Hay cupo en la clase de pilates?',
          descripcion: 'Gemini ejecutará buscar_clase y validar_cupo',
        },
      ],
    };
  }
}
