/**
 * Tipos para las Tools MCP
 * Las Tools siguen el formato de Function Calling de Gemini
 */

// Definición de un parámetro de Tool (JSON Schema)
export interface ToolParameter {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: string[];
  items?: ToolParameter;
  properties?: Record<string, ToolParameter>;
  required?: string[];
}

// Esquema de parámetros de una Tool
export interface ToolParametersSchema {
  type: 'object';
  properties: Record<string, ToolParameter>;
  required: string[];
}

// Definición de una Tool para MCP/Gemini
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: ToolParametersSchema;
}

// Resultado de ejecución de una Tool
export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

// Interfaz que debe implementar cada Tool
export interface Tool {
  // Definición de la Tool (para enviar a Gemini)
  definition: ToolDefinition;
  
  // Método para ejecutar la Tool
  execute(params: Record<string, unknown>): Promise<ToolResult>;
  
  // Método para validar parámetros
  validate(params: Record<string, unknown>): { valid: boolean; errors?: string[] };
}

// Entidades del dominio (Gimnasio)
export interface Clase {
  id: number;
  nombre: string;
  horario: string;
  cupo: number;
  instructor: string;
  created_at?: string;
}

export interface Inscripcion {
  id: number;
  clase_id: number;
  alumno: string;
  email: string;
  message_id?: string;
  created_at?: string;
}
