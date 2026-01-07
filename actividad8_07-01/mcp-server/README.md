# MCP Server - Sistema de Gestión de Gimnasio

## Descripción

Servidor MCP (Model Context Protocol) que expone herramientas del dominio de gimnasio mediante el protocolo JSON-RPC 2.0. Este servidor actúa como intermediario entre el API Gateway (con Gemini AI) y los microservicios backend.

## Arquitectura

```
┌─────────────────────┐
│   API Gateway       │
│   (Gemini AI)       │
└──────────┬──────────┘
           │ JSON-RPC 2.0
           ▼
┌─────────────────────┐
│    MCP Server       │  ◄── Este servicio
│    (Puerto 3001)    │
└──────────┬──────────┘
           │ REST HTTP
           ▼
┌─────────────────────┐
│  Backend NestJS     │
│  ms-clases (3001*)  │
│  ms-inscripciones   │
└─────────────────────┘
```

## Tools Disponibles

### 1. `buscar_clase` (Búsqueda)

Busca clases del gimnasio por diferentes criterios.

**Parámetros:**

- `nombre` (string, opcional): Nombre de la clase
- `instructor` (string, opcional): Nombre del instructor
- `horario` (string, opcional): Horario de la clase

### 2. `validar_cupo` (Validación)

Verifica si hay cupo disponible en una clase.

**Parámetros:**

- `clase_id` (integer, opcional): ID de la clase
- `nombre_clase` (string, opcional): Nombre de la clase

### 3. `inscribir_alumno` (Acción)

Registra la inscripción de un alumno a una clase.

**Parámetros:**

- `clase_id` (integer, requerido): ID de la clase
- `nombre_alumno` (string, requerido): Nombre del alumno
- `email` (string, requerido): Email del alumno

## Instalación

```bash
cd mcp-server
npm install
```

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm start
```

## Endpoints

### JSON-RPC 2.0

- `POST /rpc` - Endpoint principal JSON-RPC

### REST (Debug)

- `GET /health` - Health check
- `GET /tools` - Listar tools
- `GET /tools/:name` - Info de una tool
- `POST /tools/:name/execute` - Ejecutar tool

## Ejemplos JSON-RPC

### Inicializar

```json
{
  "jsonrpc": "2.0",
  "method": "initialize",
  "id": 1
}
```

### Listar Tools

```json
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 2
}
```

### Ejecutar Tool

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "buscar_clase",
    "arguments": {
      "nombre": "Yoga"
    }
  },
  "id": 3
}
```

## Variables de Entorno

| Variable             | Valor por defecto     | Descripción              |
| -------------------- | --------------------- | ------------------------ |
| PORT                 | 3001                  | Puerto del servidor      |
| MS_CLASES_URL        | http://localhost:3001 | URL del MS Clases        |
| MS_INSCRIPCIONES_URL | http://localhost:3002 | URL del MS Inscripciones |

## Estructura del Proyecto

```
mcp-server/
├── src/
│   ├── server.ts              # Servidor Express + JSON-RPC
│   ├── types/
│   │   ├── json-rpc.types.ts  # Tipos JSON-RPC 2.0
│   │   └── tool.types.ts      # Tipos de Tools
│   ├── tools/
│   │   ├── registry.ts        # Registro de Tools
│   │   ├── buscar-clase.tool.ts
│   │   ├── validar-cupo.tool.ts
│   │   └── inscribir-alumno.tool.ts
│   └── services/
│       └── backend-client.ts  # Cliente HTTP para Backend
├── package.json
├── tsconfig.json
└── README.md
```
