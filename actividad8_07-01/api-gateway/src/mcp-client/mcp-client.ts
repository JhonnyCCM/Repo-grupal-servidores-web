/**
 * MCP Client
 * Cliente para comunicarse con el MCP Server via JSON-RPC 2.0
 */

import axios, { AxiosInstance } from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Tipos JSON-RPC
interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params?: Record<string, unknown>;
  id: string | number;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: string | number | null;
}

// Tipos de Tools
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required: string[];
  };
}

export interface ToolExecutionResult {
  success: boolean;
  content?: Array<{ type: string; text: string }>;
  error?: string;
}

export class McpClient {
  private readonly httpClient: AxiosInstance;
  private readonly mcpServerUrl: string;
  private requestId: number = 0;

  constructor() {
    this.mcpServerUrl = process.env.MCP_SERVER_URL || 'http://localhost:3001';
    
    this.httpClient = axios.create({
      baseURL: this.mcpServerUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`🔌 MCP Client inicializado - URL: ${this.mcpServerUrl}`);
  }

  /**
   * Generar ID único para requests JSON-RPC
   */
  private generateId(): number {
    return ++this.requestId;
  }

  /**
   * Enviar request JSON-RPC al MCP Server
   */
  private async sendRequest(method: string, params?: Record<string, unknown>): Promise<JsonRpcResponse> {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      method,
      params,
      id: this.generateId(),
    };

    console.log(`📤 JSON-RPC Request: ${method}`);
    
    try {
      const response = await this.httpClient.post<JsonRpcResponse>('/rpc', request);
      
      if (response.data.error) {
        console.error(`❌ JSON-RPC Error: ${response.data.error.message}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error comunicando con MCP Server:', error);
      throw error;
    }
  }

  /**
   * Inicializar conexión con MCP Server
   */
  async initialize(): Promise<{ serverInfo: unknown; capabilities: unknown }> {
    const response = await this.sendRequest('initialize');
    
    if (response.error) {
      throw new Error(`Error inicializando MCP: ${response.error.message}`);
    }

    const result = response.result as { serverInfo: unknown; capabilities: unknown };
    console.log('✅ MCP Server inicializado:', result.serverInfo);
    
    return result;
  }

  /**
   * Obtener lista de tools disponibles
   */
  async listTools(): Promise<ToolDefinition[]> {
    const response = await this.sendRequest('tools/list');
    
    if (response.error) {
      throw new Error(`Error listando tools: ${response.error.message}`);
    }

    const result = response.result as { tools: ToolDefinition[] };
    console.log(`📋 Tools disponibles: ${result.tools.map(t => t.name).join(', ')}`);
    
    return result.tools;
  }

  /**
   * Convertir tools a formato Gemini Function Declarations
   */
  async getGeminiFunctionDeclarations(): Promise<Array<{
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<string, unknown>;
      required: string[];
    };
  }>> {
    const tools = await this.listTools();
    
    return tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: {
        type: tool.inputSchema.type,
        properties: tool.inputSchema.properties,
        required: tool.inputSchema.required,
      },
    }));
  }

  /**
   * Ejecutar una tool específica
   */
  async callTool(name: string, args: Record<string, unknown>): Promise<ToolExecutionResult> {
    console.log(`🔧 Ejecutando tool: ${name}`);
    console.log(`   Args: ${JSON.stringify(args)}`);

    const response = await this.sendRequest('tools/call', {
      name,
      arguments: args,
    });

    if (response.error) {
      return {
        success: false,
        error: response.error.message,
      };
    }

    const result = response.result as { content: Array<{ type: string; text: string }>; isError: boolean };
    
    return {
      success: !result.isError,
      content: result.content,
    };
  }

  /**
   * Health check del MCP Server
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.httpClient.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

// Exportar instancia singleton
export const mcpClient = new McpClient();
