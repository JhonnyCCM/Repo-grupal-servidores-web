import { IsString, IsOptional, IsNotEmpty, MinLength } from 'class-validator';

/**
 * DTO para procesar una solicitud de lenguaje natural
 */
export class ProcesarSolicitudDto {
  @IsString()
  @IsNotEmpty({ message: 'El mensaje es requerido' })
  @MinLength(3, { message: 'El mensaje debe tener al menos 3 caracteres' })
  mensaje: string;

  @IsString()
  @IsOptional()
  contexto?: string;
}

/**
 * DTO para respuesta del procesamiento
 */
export class RespuestaProcesadaDto {
  success: boolean;
  respuesta: string;
  toolsEjecutadas: Array<{
    nombre: string;
    argumentos: Record<string, unknown>;
    resultado: unknown;
  }>;
  tiempoProcesamiento?: number;
  error?: string;
}
