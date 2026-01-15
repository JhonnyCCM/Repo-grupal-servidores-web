/**
 * MCP Server
 * Servidor Express que implementa el protocolo JSON-RPC 2.0
 * Expone las Tools del dominio de negocio para ser consumidas por el API Gateway
 * 
 * Especificación JSON-RPC 2.0: https://www.jsonrpc.org/specification
 * Documentación MCP: https://modelcontextprotocol.io
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import {
  JsonRpcRequest,
  JsonRpcResponse,
  createSuccessResponse,
  createErrorResponse,
  JSON_RPC_ERROR_CODES,
} from './types/json-rpc.types';
import { toolRegistry } from './tools/registry';

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log(`\n📨 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// ============================================
// ENDPOINTS JSON-RPC 2.0
// ============================================

/**
 * POST /rpc
 * Endpoint principal JSON-RPC 2.0
 * Procesa solicitudes según la especificación del protocolo
 */
app.post('/rpc', async (req: Request, res: Response) => {
  const request = req.body as JsonRpcRequest;
  
  console.log('📥 JSON-RPC Request:', JSON.stringify(request, null, 2));

  // Validar estructura JSON-RPC
  if (!request.jsonrpc || request.jsonrpc !== '2.0') {
    const response = createErrorResponse(
      request.id || null,
      JSON_RPC_ERROR_CODES.INVALID_REQUEST,
      'Invalid Request: jsonrpc must be "2.0"'
    );
    return res.json(response);
  }

  if (!request.method || typeof request.method !== 'string') {
    const response = createErrorResponse(
      request.id || null,
      JSON_RPC_ERROR_CODES.INVALID_REQUEST,
      'Invalid Request: method is required and must be a string'
    );
    return res.json(response);
  }

  // Procesar métodos MCP
  let response: JsonRpcResponse;

  try {
    switch (request.method) {
      case 'tools/list':
        response = await handleToolsList(request);
        break;

      case 'tools/call':
        response = await handleToolsCall(request);
        break;

      case 'initialize':
        response = handleInitialize(request);
        break;

      case 'ping':
        response = createSuccessResponse(request.id, { pong: true, timestamp: Date.now() });
        break;

      default:
        response = createErrorResponse(
          request.id,
          JSON_RPC_ERROR_CODES.METHOD_NOT_FOUND,
          `Method not found: ${request.method}`
        );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error processing request:', errorMessage);
    
    response = createErrorResponse(
      request.id,
      JSON_RPC_ERROR_CODES.INTERNAL_ERROR,
      `Internal error: ${errorMessage}`
    );
  }

  console.log('📤 JSON-RPC Response:', JSON.stringify(response, null, 2));
  res.json(response);
});

// ============================================
// HANDLERS DE MÉTODOS MCP
// ============================================

/**
 * Handler para initialize
 * Retorna información del servidor MCP
 */
function handleInitialize(request: JsonRpcRequest): JsonRpcResponse {
  console.log('🚀 MCP Initialize request');
  
  return createSuccessResponse(request.id, {
    protocolVersion: '2024-11-05',
    serverInfo: {
      name: 'gym-mcp-server',
      version: '1.0.0',
      description: 'MCP Server para Sistema de Gestión de Gimnasio',
    },
    capabilities: {
      tools: {
        listChanged: false,
      },
    },
  });
}

/**
 * Handler para tools/list
 * Retorna la lista de herramientas disponibles
 */
async function handleToolsList(request: JsonRpcRequest): Promise<JsonRpcResponse> {
  console.log('📋 Listando tools disponibles');
  
  const tools = toolRegistry.getDefinitions().map(def => ({
    name: def.name,
    description: def.description,
    inputSchema: {
      type: 'object',
      properties: def.parameters.properties,
      required: def.parameters.required,
    },
  }));

  return createSuccessResponse(request.id, { tools });
}

/**
 * Handler para tools/call
 * Ejecuta una herramienta específica
 */
async function handleToolsCall(request: JsonRpcRequest): Promise<JsonRpcResponse> {
  const params = request.params as Record<string, unknown>;

  if (!params || !params.name) {
    return createErrorResponse(
      request.id,
      JSON_RPC_ERROR_CODES.INVALID_PARAMS,
      'Invalid params: "name" is required for tools/call'
    );
  }

  const toolName = params.name as string;
  const toolArgs = (params.arguments || {}) as Record<string, unknown>;

  console.log(`🔧 Ejecutando tool: ${toolName}`);
  console.log(`   Argumentos:`, JSON.stringify(toolArgs));

  // Verificar que la tool existe
  if (!toolRegistry.has(toolName)) {
    return createErrorResponse(
      request.id,
      JSON_RPC_ERROR_CODES.METHOD_NOT_FOUND,
      `Tool not found: ${toolName}. Available tools: ${toolRegistry.list().join(', ')}`
    );
  }

  // Ejecutar la tool
  const result = await toolRegistry.execute(toolName, toolArgs);

  if (!result.success) {
    return createErrorResponse(
      request.id,
      JSON_RPC_ERROR_CODES.TOOL_EXECUTION_ERROR,
      result.error || 'Tool execution failed'
    );
  }

  return createSuccessResponse(request.id, {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result.result, null, 2),
      },
    ],
    isError: false,
  });
}

// ============================================
// ENDPOINTS REST ADICIONALES (para debugging)
// ============================================

/**
 * GET /health
 * Health check del servidor
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'mcp-server',
    timestamp: new Date().toISOString(),
    tools: toolRegistry.list(),
  });
});

/**
 * GET /tools
 * Lista las tools disponibles (REST para debugging)
 */
app.get('/tools', (req: Request, res: Response) => {
  res.json({
    tools: toolRegistry.getDefinitions(),
    geminiFormat: toolRegistry.getGeminiFunctionDeclarations(),
  });
});

/**
 * GET /tools/:name
 * Información detallada de una tool
 */
app.get('/tools/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  const info = toolRegistry.getToolInfo(name);
  
  if (!info.exists) {
    return res.status(404).json({
      error: `Tool not found: ${name}`,
      availableTools: toolRegistry.list(),
    });
  }

  res.json(info);
});

/**
 * POST /tools/:name/execute
 * Ejecutar una tool directamente (REST para debugging)
 */
app.post('/tools/:name/execute', async (req: Request, res: Response) => {
  const { name } = req.params;
  const params = req.body;

  console.log(`\n🧪 [DEBUG] Ejecutando tool via REST: ${name}`);

  const result = await toolRegistry.execute(name, params);
  
  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json(result);
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    🤖 MCP SERVER                           ║');
  console.log('║          Model Context Protocol - Gimnasio                 ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║  🌐 Puerto:     ${PORT}                                        ║`);
  console.log(`║  📡 JSON-RPC:   http://localhost:${PORT}/rpc                    ║`);
  console.log(`║  ❤️  Health:     http://localhost:${PORT}/health                ║`);
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log('║  🔧 Tools disponibles:                                     ║');
  toolRegistry.list().forEach(tool => {
    console.log(`║     • ${tool.padEnd(50)}║`);
  });
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log('║  📖 Métodos JSON-RPC soportados:                           ║');
  console.log('║     • initialize     - Inicializar conexión MCP            ║');
  console.log('║     • tools/list     - Listar herramientas disponibles     ║');
  console.log('║     • tools/call     - Ejecutar una herramienta            ║');
  console.log('║     • ping           - Test de conectividad                ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
});

export default app;
