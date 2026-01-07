/**
 * Tool: buscar_clase
 * Permite buscar clases del gimnasio por nombre, instructor u horario
 * Esta es una Tool de BÚSQUEDA según el taller
 */

import { Tool, ToolDefinition, ToolResult } from '../types/tool.types';
import { backendClient } from '../services/backend-client';

export class BuscarClaseTool implements Tool {
  definition: ToolDefinition = {
    name: 'buscar_clase',
    description: 'Busca clases del gimnasio por nombre, instructor u horario. Utiliza esta herramienta cuando el usuario quiera encontrar clases disponibles o información sobre una clase específica.',
    parameters: {
      type: 'object',
      properties: {
        nombre: {
          type: 'string',
          description: 'Nombre o parte del nombre de la clase a buscar (ej: "Yoga", "Spinning", "Pilates")',
        },
        instructor: {
          type: 'string',
          description: 'Nombre del instructor de la clase',
        },
        horario: {
          type: 'string',
          description: 'Horario o día de la clase (ej: "Lunes", "18:00", "mañana")',
        },
      },
      required: [], // Todos los parámetros son opcionales
    },
  };

  validate(params: Record<string, unknown>): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    // Validar que al menos un parámetro esté presente
    if (!params.nombre && !params.instructor && !params.horario) {
      // Si no hay filtros, retornará todas las clases (es válido)
      console.log('📋 Búsqueda sin filtros - se retornarán todas las clases');
    }

    // Validar tipos
    if (params.nombre !== undefined && typeof params.nombre !== 'string') {
      errors.push('El parámetro "nombre" debe ser una cadena de texto');
    }
    if (params.instructor !== undefined && typeof params.instructor !== 'string') {
      errors.push('El parámetro "instructor" debe ser una cadena de texto');
    }
    if (params.horario !== undefined && typeof params.horario !== 'string') {
      errors.push('El parámetro "horario" debe ser una cadena de texto');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    console.log('🔧 Ejecutando Tool: buscar_clase');
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
      // Buscar clases en el backend
      const clases = await backendClient.buscarClases({
        nombre: params.nombre as string | undefined,
        instructor: params.instructor as string | undefined,
        horario: params.horario as string | undefined,
      });

      if (clases.length === 0) {
        return {
          success: true,
          data: {
            mensaje: 'No se encontraron clases con los criterios especificados',
            clases: [],
            total: 0,
          },
        };
      }

      return {
        success: true,
        data: {
          mensaje: `Se encontraron ${clases.length} clase(s)`,
          clases: clases.map(c => ({
            id: c.id,
            nombre: c.nombre,
            instructor: c.instructor,
            horario: c.horario,
            cupoDisponible: c.cupo,
          })),
          total: clases.length,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ Error en buscar_clase:', errorMessage);
      
      return {
        success: false,
        error: `Error al buscar clases: ${errorMessage}`,
      };
    }
  }
}

export const buscarClaseTool = new BuscarClaseTool();
