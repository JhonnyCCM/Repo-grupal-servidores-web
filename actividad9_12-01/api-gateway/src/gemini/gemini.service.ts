/**
 * Gemini Service
 * Servicio para integrar Google Gemini AI con Function Calling
 * Permite que Gemini decida qué Tools ejecutar basándose en la intención del usuario
 */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel, Part, FunctionDeclaration } from '@google/generative-ai';
import { mcpClient } from '../mcp-client/mcp-client';

export interface ProcessResult {
  success: boolean;
  response: string;
  toolsExecuted: Array<{
    name: string;
    args: Record<string, unknown>;
    result: unknown;
  }>;
  error?: string;
}

@Injectable()
export class GeminiService implements OnModuleInit {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private tools: any[] = [];
  private functionDeclarationsCount: number = 0;
  private isInitialized: boolean = false;

  async onModuleInit() {
    await this.initialize();
  }

  /**
   * Inicializar el servicio de Gemini
   */
  async initialize(): Promise<void> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('⚠️ GEMINI_API_KEY no configurada. El servicio funcionará en modo demo.');
      return;
    }

    try {
      console.log('🚀 Inicializando Gemini Service...');

      this.genAI = new GoogleGenerativeAI(apiKey);

      // Obtener las function declarations del MCP Server
      const functionDeclarations = await this.loadFunctionDeclarations();

      this.tools = [{
        functionDeclarations: functionDeclarations as FunctionDeclaration[],
      }];

      this.functionDeclarationsCount = functionDeclarations.length;

      // Configurar el modelo con las tools
      this.model = this.genAI.getGenerativeModel({
        model: 'models/gemini-2.5-flash',
        tools: this.tools,
      });

      this.isInitialized = true;
      console.log('✅ Gemini Service inicializado correctamente');
      console.log(`   Tools cargadas: ${functionDeclarations.map(t => t.name).join(', ')}`);

    } catch (error) {
      console.error('❌ Error inicializando Gemini Service:', error);
      throw error;
    }
  }

  /**
   * Cargar las function declarations desde el MCP Server
   */
  private async loadFunctionDeclarations(): Promise<FunctionDeclaration[]> {
    try {
      // Verificar que el MCP Server está disponible
      const isHealthy = await mcpClient.healthCheck();

      if (!isHealthy) {
        console.warn('⚠️ MCP Server no disponible, usando tools por defecto');
        return this.getDefaultFunctionDeclarations();
      }

      // Obtener tools del MCP Server
      const tools = await mcpClient.getGeminiFunctionDeclarations();

      return tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      })) as FunctionDeclaration[];

    } catch (error) {
      console.warn('⚠️ Error cargando tools del MCP Server:', error);
      return this.getDefaultFunctionDeclarations();
    }
  }

  /**
   * Tools por defecto si el MCP Server no está disponible
   */
  private getDefaultFunctionDeclarations(): FunctionDeclaration[] {
    return [
      {
        name: 'buscar_clase',
        description: 'Busca clases del gimnasio por nombre, instructor u horario',
        parameters: {
          type: 'object',
          properties: {
            nombre: { type: 'string', description: 'Nombre de la clase' },
            instructor: { type: 'string', description: 'Nombre del instructor' },
            horario: { type: 'string', description: 'Horario de la clase' },
          },
          required: [],
        },
      },
      {
        name: 'validar_cupo',
        description: 'Valida si hay cupo disponible en una clase',
        parameters: {
          type: 'object',
          properties: {
            clase_id: { type: 'integer', description: 'ID de la clase' },
            nombre_clase: { type: 'string', description: 'Nombre de la clase' },
          },
          required: [],
        },
      },
      {
        name: 'inscribir_alumno',
        description: 'Registra la inscripción de un alumno a una clase',
        parameters: {
          type: 'object',
          properties: {
            clase_id: { type: 'integer', description: 'ID de la clase' },
            nombre_alumno: { type: 'string', description: 'Nombre del alumno' },
            email: { type: 'string', description: 'Email del alumno' },
          },
          required: ['clase_id', 'nombre_alumno', 'email'],
        },
      },
    ] as FunctionDeclaration[];
  }

  /**
   * Procesar una solicitud del usuario utilizando Gemini y las Tools MCP
   */
  async processUserRequest(userMessage: string): Promise<ProcessResult> {
    console.log('\n🤖 === Procesando solicitud con Gemini ===');
    console.log(`📝 Usuario: "${userMessage}"`);

    const toolsExecuted: ProcessResult['toolsExecuted'] = [];

    // Si no está inicializado, retornar respuesta demo
    if (!this.isInitialized) {
      return {
        success: false,
        response: 'El servicio de IA no está configurado. Por favor, configure GEMINI_API_KEY.',
        toolsExecuted: [],
        error: 'GEMINI_API_KEY no configurada',
      };
    }

    try {
      // Crear el chat con contexto del sistema
      const chat = this.model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      // Enviar mensaje inicial con contexto
      const systemContext = `
Eres un asistente virtual del Sistema de Gestión de Gimnasio con acceso a herramientas (tools).

REGLAS OBLIGATORIAS:
1. SIEMPRE que el usuario mencione una clase por NOMBRE, DEBES usar la tool "buscar_clase".
2. ANTES de inscribir a un alumno, DEBES usar la tool "validar_cupo".
3. NO pidas el ID de la clase al usuario si puedes obtenerlo usando tools.
4. SOLO pregunta al usuario si la información NO puede obtenerse mediante tools.
5. Si hay una sola clase coincidente, continúa automáticamente el flujo.
6. Si hay múltiples clases, pide aclaración mostrando los IDs.
7. Usa las tools de forma encadenada hasta resolver completamente la solicitud.

FLUJO ESPERADO:
- Buscar clase
- Validar cupo
- Inscribir alumno (si hay cupo)

Responde siempre en español, de forma clara y profesional.
Confirma explícitamente cada acción realizada mediante tools.
`;


      const fullMessage = `${systemContext}\n\nSolicitud del usuario: ${userMessage}`;

      // Primera llamada a Gemini
      let result = await chat.sendMessage(fullMessage);
      let response = result.response;

      // Loop para manejar múltiples function calls
      let maxIterations = 5;
      let iteration = 0;

      while (response.functionCalls() && response.functionCalls()!.length > 0 && iteration < maxIterations) {
        iteration++;
        const functionCalls = response.functionCalls()!;

        console.log(`\n🔧 Gemini solicita ejecutar ${functionCalls.length} tool(s):`);

        const functionResponses: Part[] = [];

        for (const functionCall of functionCalls) {
          console.log(`   📌 ${functionCall.name}(${JSON.stringify(functionCall.args)})`);

          // Ejecutar la tool via MCP
          const toolResult = await mcpClient.callTool(
            functionCall.name,
            functionCall.args as Record<string, unknown>
          );

          // Parsear el resultado
          let resultData: unknown;
          if (toolResult.content && toolResult.content.length > 0) {
            try {
              resultData = JSON.parse(toolResult.content[0].text);
            } catch {
              resultData = toolResult.content[0].text;
            }
          } else {
            resultData = { error: toolResult.error || 'No result' };
          }

          toolsExecuted.push({
            name: functionCall.name,
            args: functionCall.args as Record<string, unknown>,
            result: resultData,
          });

          console.log(`   ✅ Resultado: ${JSON.stringify(resultData).substring(0, 100)}...`);

          functionResponses.push({
            functionResponse: {
              name: functionCall.name,
              response: { result: resultData },
            },
          });
        }

        // Enviar resultados de las tools a Gemini
        result = await chat.sendMessage(functionResponses);
        response = result.response;
      }

      // Obtener respuesta final
      const finalResponse = response.text();
      console.log(`\n💬 Respuesta final: "${finalResponse.substring(0, 200)}..."`);

      return {
        success: true,
        response: finalResponse,
        toolsExecuted,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ Error procesando solicitud:', errorMessage);

      return {
        success: false,
        response: `Lo siento, ocurrió un error procesando tu solicitud: ${errorMessage}`,
        toolsExecuted,
        error: errorMessage,
      };
    }
  }

  /**
   * Verificar si el servicio está disponible
   */
  isAvailable(): boolean {
    return this.isInitialized;
  }

  /**
   * Obtener información del servicio
   */
  getStatus(): { initialized: boolean; model: string; toolsCount: number } {
    return {
      initialized: this.isInitialized,
      model: 'models/gemini-2.5-flash',
      toolsCount: this.functionDeclarationsCount,
    };
  }
}
