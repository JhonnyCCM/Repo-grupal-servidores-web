/**
 * Backend Client
 * Cliente HTTP para comunicarse con el microservicio Backend (NestJS)
 * Realiza llamadas REST al servicio existente de clases e inscripciones
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { Clase, Inscripcion } from '../types/tool.types';

export class BackendClient {
  private readonly httpClient: AxiosInstance;
  private readonly clasesUrl: string;
  private readonly inscripcionesUrl: string;

  constructor() {
    // URLs de los microservicios backend (configurables por env)
    this.clasesUrl = process.env.MS_CLASES_URL || 'http://localhost:3003';
    this.inscripcionesUrl = process.env.MS_INSCRIPCIONES_URL || 'http://localhost:3002';

    this.httpClient = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔌 Backend Client inicializado');
    console.log(`   📚 MS-Clases: ${this.clasesUrl}`);
    console.log(`   📝 MS-Inscripciones: ${this.inscripcionesUrl}`);
  }

  // ============================================
  // OPERACIONES DE CLASES
  // ============================================

  /**
   * Buscar clases por diferentes criterios
   */
  async buscarClases(filtros: {
    nombre?: string;
    instructor?: string;
    horario?: string;
  }): Promise<Clase[]> {
    try {
      console.log('🔍 Buscando clases con filtros:', filtros);
      
      const response = await this.httpClient.get<Clase[]>(`${this.clasesUrl}/clases`);
      let clases = response.data;

      // Aplicar filtros localmente (el backend no tiene filtros)
      if (filtros.nombre) {
        clases = clases.filter(c => 
          c.nombre.toLowerCase().includes(filtros.nombre!.toLowerCase())
        );
      }
      if (filtros.instructor) {
        clases = clases.filter(c => 
          c.instructor.toLowerCase().includes(filtros.instructor!.toLowerCase())
        );
      }
      if (filtros.horario) {
        clases = clases.filter(c => 
          c.horario.toLowerCase().includes(filtros.horario!.toLowerCase())
        );
      }

      console.log(`✅ Encontradas ${clases.length} clases`);
      return clases;
    } catch (error) {
      console.error('❌ Error buscando clases:', this.getErrorMessage(error));
      throw new Error(`Error al buscar clases: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Obtener una clase por ID
   */
  async obtenerClase(id: number): Promise<Clase | null> {
    try {
      console.log(`🔍 Obteniendo clase con ID: ${id}`);
      const response = await this.httpClient.get<Clase>(`${this.clasesUrl}/clases/${id}`);
      console.log(`✅ Clase encontrada: ${response.data.nombre}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log(`⚠️ Clase con ID ${id} no encontrada`);
        return null;
      }
      console.error('❌ Error obteniendo clase:', this.getErrorMessage(error));
      throw new Error(`Error al obtener clase: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Verificar cupo disponible en una clase
   */
  async verificarCupo(claseId: number): Promise<{ disponible: boolean; cupoActual: number; clase: Clase | null }> {
    try {
      console.log(`🔍 Verificando cupo para clase ID: ${claseId}`);
      const clase = await this.obtenerClase(claseId);
      
      if (!clase) {
        return { disponible: false, cupoActual: 0, clase: null };
      }

      const disponible = clase.cupo > 0;
      console.log(`✅ Cupo actual: ${clase.cupo}, Disponible: ${disponible}`);
      
      return {
        disponible,
        cupoActual: clase.cupo,
        clase,
      };
    } catch (error) {
      console.error('❌ Error verificando cupo:', this.getErrorMessage(error));
      throw new Error(`Error al verificar cupo: ${this.getErrorMessage(error)}`);
    }
  }

  // ============================================
  // OPERACIONES DE INSCRIPCIONES
  // ============================================

  /**
   * Crear una nueva inscripción
   */
  async crearInscripcion(data: {
    claseId: number;
    alumno: string;
    email: string;
  }): Promise<Inscripcion> {
    try {
      console.log('📝 Creando inscripción:', data);
      
      const response = await this.httpClient.post<{ received: boolean; messageId: string }>(
        `${this.inscripcionesUrl}/inscripciones`,
        {
          claseId: data.claseId,
          alumno: data.alumno,
          email: data.email,
        }
      );

      console.log(`✅ Inscripción creada con messageId: ${response.data.messageId}`);
      
      // Retornar objeto de inscripción (la inscripción real se procesa async)
      return {
        id: 0, // Se asignará en el backend
        clase_id: data.claseId,
        alumno: data.alumno,
        email: data.email,
        message_id: response.data.messageId,
      };
    } catch (error) {
      console.error('❌ Error creando inscripción:', this.getErrorMessage(error));
      throw new Error(`Error al crear inscripción: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Listar todas las inscripciones
   */
  async listarInscripciones(): Promise<Inscripcion[]> {
    try {
      console.log('📋 Listando inscripciones');
      const response = await this.httpClient.get<Inscripcion[]>(`${this.inscripcionesUrl}/inscripciones`);
      console.log(`✅ Encontradas ${response.data.length} inscripciones`);
      return response.data;
    } catch (error) {
      console.error('❌ Error listando inscripciones:', this.getErrorMessage(error));
      throw new Error(`Error al listar inscripciones: ${this.getErrorMessage(error)}`);
    }
  }

  // ============================================
  // UTILIDADES
  // ============================================

  private getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return `${axiosError.response.status}: ${JSON.stringify(axiosError.response.data)}`;
      }
      if (axiosError.code === 'ECONNREFUSED') {
        return 'Backend no disponible (conexión rechazada)';
      }
      return axiosError.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'Error desconocido';
  }

  /**
   * Verificar conectividad con los backends
   */
  async healthCheck(): Promise<{ clases: boolean; inscripciones: boolean }> {
    const result = { clases: false, inscripciones: false };
    
    try {
      await this.httpClient.get(`${this.clasesUrl}/health`, { timeout: 2000 });
      result.clases = true;
    } catch {
      console.log('⚠️ MS-Clases no responde');
    }

    try {
      await this.httpClient.get(`${this.inscripcionesUrl}/health`, { timeout: 2000 });
      result.inscripciones = true;
    } catch {
      console.log('⚠️ MS-Inscripciones no responde');
    }

    return result;
  }
}

// Singleton para reutilizar la instancia
export const backendClient = new BackendClient();
