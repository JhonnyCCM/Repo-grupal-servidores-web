/**
 * Tipos para JSON-RPC 2.0
 * Especificación: https://www.jsonrpc.org/specification
 */

// Request JSON-RPC 2.0
export interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params?: Record<string, unknown> | unknown[];
  id: string | number | null;
}

// Response JSON-RPC 2.0 exitosa
export interface JsonRpcSuccessResponse {
  jsonrpc: '2.0';
  result: unknown;
  id: string | number | null;
}

// Response JSON-RPC 2.0 con error
export interface JsonRpcErrorResponse {
  jsonrpc: '2.0';
  error: JsonRpcError;
  id: string | number | null;
}

// Objeto de error JSON-RPC
export interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

// Union type para cualquier respuesta
export type JsonRpcResponse = JsonRpcSuccessResponse | JsonRpcErrorResponse;

// Códigos de error estándar JSON-RPC
export const JSON_RPC_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  // Errores personalizados del servidor (-32000 a -32099)
  TOOL_EXECUTION_ERROR: -32000,
  BACKEND_UNAVAILABLE: -32001,
  VALIDATION_ERROR: -32002,
} as const;

// Helper para crear respuestas exitosas
export function createSuccessResponse(id: string | number | null, result: unknown): JsonRpcSuccessResponse {
  return {
    jsonrpc: '2.0',
    result,
    id,
  };
}

// Helper para crear respuestas de error
export function createErrorResponse(
  id: string | number | null,
  code: number,
  message: string,
  data?: unknown
): JsonRpcErrorResponse {
  return {
    jsonrpc: '2.0',
    error: { code, message, data },
    id,
  };
}
