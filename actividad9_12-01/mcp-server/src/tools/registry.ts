/**
 * Registry de Tools
 * Registro central de todas las herramientas disponibles en el MCP Server
 * Proporciona métodos para listar, obtener y ejecutar tools
 */

import { Tool, ToolDefinition } from '../types/tool.types';
import { buscarClaseTool } from './buscar-clase.tool';
import { validarCupoTool } from './validar-cupo.tool';
import { inscribirAlumnoTool } from './inscribir-alumno.tool';

class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  constructor() {
    // Registrar todas las tools disponibles
    this.register(buscarClaseTool);
    this.register(validarCupoTool);
    this.register(inscribirAlumnoTool);

    console.log('📦 Tool Registry inicializado');
    console.log(`   Herramientas registradas: ${this.tools.size}`);
    this.tools.forEach((_, name) => console.log(`   • ${name}`));
  }

  /**
   * Registrar una nueva tool
   */
  register(tool: Tool): void {
    this.tools.set(tool.definition.name, tool);
    console.log(`✅ Tool registrada: ${tool.definition.name}`);
  }

  /**
   * Obtener una tool por nombre
   */
  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  /**
   * Verificar si existe una tool
   */
  has(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * Listar todas las tools disponibles
   */
  list(): string[] {
    return Array.from(this.tools.keys());
  }

  /**
   * Obtener las definiciones de todas las tools
   * (formato para enviar a Gemini como function declarations)
   */
  getDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values()).map(tool => tool.definition);
  }

  /**
   * Obtener definiciones en formato Gemini Function Calling
   */
  getGeminiFunctionDeclarations(): Array<{
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<string, unknown>;
      required: string[];
    };
  }> {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.definition.name,
      description: tool.definition.description,
      parameters: {
        type: 'object',
        properties: tool.definition.parameters.properties,
        required: tool.definition.parameters.required,
      },
    }));
  }

  /**
   * Ejecutar una tool por nombre
   */
  async execute(name: string, params: Record<string, unknown>): Promise<{
    success: boolean;
    result?: unknown;
    error?: string;
  }> {
    const tool = this.get(name);
    
    if (!tool) {
      return {
        success: false,
        error: `Tool no encontrada: ${name}. Tools disponibles: ${this.list().join(', ')}`,
      };
    }

    try {
      console.log(`\n🔧 === Ejecutando Tool: ${name} ===`);
      const result = await tool.execute(params);
      console.log(`✅ === Tool ${name} completada ===\n`);
      
      return {
        success: result.success,
        result: result.data,
        error: result.error,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error(`❌ Error ejecutando tool ${name}:`, errorMessage);
      
      return {
        success: false,
        error: `Error interno ejecutando ${name}: ${errorMessage}`,
      };
    }
  }

  /**
   * Obtener información detallada de una tool
   */
  getToolInfo(name: string): {
    exists: boolean;
    definition?: ToolDefinition;
    parametersRequired?: string[];
    parametersOptional?: string[];
  } {
    const tool = this.get(name);
    
    if (!tool) {
      return { exists: false };
    }

    const allParams = Object.keys(tool.definition.parameters.properties);
    const requiredParams = tool.definition.parameters.required;
    const optionalParams = allParams.filter(p => !requiredParams.includes(p));

    return {
      exists: true,
      definition: tool.definition,
      parametersRequired: requiredParams,
      parametersOptional: optionalParams,
    };
  }
}

// Exportar instancia singleton
export const toolRegistry = new ToolRegistry();
