/**
 * Tool: inscribir_alumno
 * Registra la inscripción de un alumno a una clase del gimnasio
 * Esta es una Tool de ACCIÓN según el taller
 */

import { Tool, ToolDefinition, ToolResult } from '../types/tool.types';
import { backendClient } from '../services/backend-client';

export class InscribirAlumnoTool implements Tool {
  definition: ToolDefinition = {
    name: 'inscribir_alumno',
    description: 'Registra la inscripción de un alumno a una clase del gimnasio. Utiliza esta herramienta después de validar que hay cupo disponible para completar el proceso de inscripción.',
    parameters: {
      type: 'object',
      properties: {
        clase_id: {
          type: 'integer',
          description: 'ID numérico de la clase donde inscribir al alumno',
        },
        nombre_alumno: {
          type: 'string',
          description: 'Nombre completo del alumno a inscribir',
        },
        email: {
          type: 'string',
          description: 'Correo electrónico del alumno para notificaciones',
        },
      },
      required: ['clase_id', 'nombre_alumno', 'email'],
    },
  };

  validate(params: Record<string, unknown>): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    // Validar clase_id
    if (params.clase_id === undefined) {
      errors.push('El parámetro "clase_id" es requerido');
    } else {
      const claseId = Number(params.clase_id);
      if (isNaN(claseId) || claseId <= 0) {
        errors.push('El parámetro "clase_id" debe ser un número entero positivo');
      }
    }

    // Validar nombre_alumno
    if (!params.nombre_alumno) {
      errors.push('El parámetro "nombre_alumno" es requerido');
    } else if (typeof params.nombre_alumno !== 'string') {
      errors.push('El parámetro "nombre_alumno" debe ser una cadena de texto');
    } else if ((params.nombre_alumno as string).trim().length < 2) {
      errors.push('El nombre del alumno debe tener al menos 2 caracteres');
    }

    // Validar email
    if (!params.email) {
      errors.push('El parámetro "email" es requerido');
    } else if (typeof params.email !== 'string') {
      errors.push('El parámetro "email" debe ser una cadena de texto');
    } else {
      // Validación básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(params.email as string)) {
        errors.push('El formato del email no es válido');
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    console.log('🔧 Ejecutando Tool: inscribir_alumno');
    console.log('   Parámetros:', JSON.stringify(params));

    // Validar parámetros
    const validation = this.validate(params);
    if (!validation.valid) {
      return {
        success: false,
        error: `Parámetros inválidos: ${validation.errors?.join(', ')}`,
      };
    }

    const claseId = Number(params.clase_id);
    const nombreAlumno = (params.nombre_alumno as string).trim();
    const email = (params.email as string).trim().toLowerCase();

    try {
      // Primero verificar que hay cupo disponible
      console.log('🔍 Verificando disponibilidad antes de inscribir...');
      const cupoCheck = await backendClient.verificarCupo(claseId);

      if (!cupoCheck.clase) {
        return {
          success: false,
          error: `No se encontró la clase con ID ${claseId}. Por favor, verifique el ID de la clase.`,
        };
      }

      if (!cupoCheck.disponible) {
        return {
          success: false,
          error: `No hay cupo disponible en la clase "${cupoCheck.clase.nombre}". El cupo actual es ${cupoCheck.cupoActual}.`,
        };
      }

      // Crear la inscripción
      console.log('📝 Creando inscripción...');
      const inscripcion = await backendClient.crearInscripcion({
        claseId,
        alumno: nombreAlumno,
        email,
      });

      return {
        success: true,
        data: {
          mensaje: `✅ ¡Inscripción exitosa! ${nombreAlumno} ha sido inscrito/a en la clase "${cupoCheck.clase.nombre}"`,
          inscripcion: {
            alumno: nombreAlumno,
            email,
            clase: {
              id: cupoCheck.clase.id,
              nombre: cupoCheck.clase.nombre,
              instructor: cupoCheck.clase.instructor,
              horario: cupoCheck.clase.horario,
            },
            messageId: inscripcion.message_id,
          },
          cupoRestante: cupoCheck.cupoActual - 1,
          fechaInscripcion: new Date().toISOString(),
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ Error en inscribir_alumno:', errorMessage);

      return {
        success: false,
        error: `Error al inscribir alumno: ${errorMessage}`,
      };
    }
  }
}

export const inscribirAlumnoTool = new InscribirAlumnoTool();
