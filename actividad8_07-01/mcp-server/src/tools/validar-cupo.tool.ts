/**
 * Tool: validar_cupo
 * Valida si hay cupo disponible en una clase específica
 * Esta es una Tool de VALIDACIÓN según el taller
 */

import { Tool, ToolDefinition, ToolResult } from '../types/tool.types';
import { backendClient } from '../services/backend-client';

export class ValidarCupoTool implements Tool {
  definition: ToolDefinition = {
    name: 'validar_cupo',
    description: 'Valida si hay cupo disponible en una clase del gimnasio. Utiliza esta herramienta antes de inscribir a un alumno para verificar que haya lugar disponible.',
    parameters: {
      type: 'object',
      properties: {
        clase_id: {
          type: 'integer',
          description: 'ID numérico de la clase a validar',
        },
        nombre_clase: {
          type: 'string',
          description: 'Nombre de la clase a validar (alternativa al ID)',
        },
      },
      required: [], // Se requiere al menos uno de los dos
    },
  };

  validate(params: Record<string, unknown>): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    // Debe tener al menos clase_id o nombre_clase
    if (params.clase_id === undefined && params.nombre_clase === undefined) {
      errors.push('Debe proporcionar el ID de la clase (clase_id) o el nombre de la clase (nombre_clase)');
    }

    // Validar tipo de clase_id
    if (params.clase_id !== undefined) {
      const claseId = Number(params.clase_id);
      if (isNaN(claseId) || claseId <= 0) {
        errors.push('El parámetro "clase_id" debe ser un número entero positivo');
      }
    }

    // Validar tipo de nombre_clase
    if (params.nombre_clase !== undefined && typeof params.nombre_clase !== 'string') {
      errors.push('El parámetro "nombre_clase" debe ser una cadena de texto');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    console.log('🔧 Ejecutando Tool: validar_cupo');
    console.log('   Parámetros:', JSON.stringify(params));

    // Validar parámetros
    const validation = this.validate(params);
    if (!validation.valid) {
      return {
        success: false,
        error: `Parámetros inválidos: ${validation.errors?.join(', ')}`,
      };
    }

    try {
      let claseId: number | undefined;

      // Si se proporciona nombre_clase, primero buscar la clase
      if (params.nombre_clase && !params.clase_id) {
        const clases = await backendClient.buscarClases({
          nombre: params.nombre_clase as string,
        });

        if (clases.length === 0) {
          return {
            success: true,
            data: {
              disponible: false,
              mensaje: `No se encontró ninguna clase con el nombre "${params.nombre_clase}"`,
              clase: null,
            },
          };
        }

        if (clases.length > 1) {
          return {
            success: true,
            data: {
              disponible: false,
              mensaje: `Se encontraron múltiples clases con el nombre "${params.nombre_clase}". Por favor, especifique el ID de la clase.`,
              clasesEncontradas: clases.map(c => ({ id: c.id, nombre: c.nombre })),
            },
          };
        }

        claseId = clases[0].id;
      } else {
        claseId = Number(params.clase_id);
      }

      // Verificar cupo
      const resultado = await backendClient.verificarCupo(claseId!);

      if (!resultado.clase) {
        return {
          success: true,
          data: {
            disponible: false,
            mensaje: `No se encontró la clase con ID ${claseId}`,
            cupoActual: 0,
          },
        };
      }

      return {
        success: true,
        data: {
          disponible: resultado.disponible,
          cupoActual: resultado.cupoActual,
          clase: {
            id: resultado.clase.id,
            nombre: resultado.clase.nombre,
            instructor: resultado.clase.instructor,
            horario: resultado.clase.horario,
          },
          mensaje: resultado.disponible
            ? `✅ Hay ${resultado.cupoActual} cupo(s) disponible(s) en la clase "${resultado.clase.nombre}"`
            : `❌ No hay cupo disponible en la clase "${resultado.clase.nombre}"`,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ Error en validar_cupo:', errorMessage);

      return {
        success: false,
        error: `Error al validar cupo: ${errorMessage}`,
      };
    }
  }
}

export const validarCupoTool = new ValidarCupoTool();
