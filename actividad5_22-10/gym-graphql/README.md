# 🏋️ Gym Management System - GraphQL Gateway

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  <img src="https://graphql.org/img/logo.svg" width="120" alt="GraphQL Logo" />
</p>

Sistema de gestión de gimnasio implementado con **NestJS** y **GraphQL**, actuando como un API Gateway que consume servicios REST. Este proyecto implementa el patrón Gateway para proporcionar una interfaz GraphQL unificada sobre una API REST existente.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Ejecución de Servicios](#-ejecución-de-servicios)
- [Documentación de Queries](#-documentación-de-queries)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Equipo y Distribución del Trabajo](#-equipo-y-distribución-del-trabajo)
- [Planificación del Proyecto](#-planificación-del-proyecto)

---

## 📖 Descripción del Proyecto

Este proyecto implementa un **GraphQL Gateway** que actúa como capa de abstracción sobre una API REST existente para la gestión de un gimnasio. El sistema permite gestionar:

- 👥 **Usuarios y Entrenadores**: Gestión de miembros y personal del gimnasio
- 🏋️ **Clases y Entrenamientos**: Programación y seguimiento de clases grupales
- 💰 **Planes y Membresías**: Gestión de suscripciones y pagos
- 🏢 **Salas y Horarios**: Administración de espacios y calendarios
- 🛠️ **Equipamiento**: Control de inventario de máquinas y equipos
- 📊 **Estadísticas y Métricas**: Dashboards y análisis de datos del negocio

### Ventajas del Enfoque GraphQL Gateway

- ✅ **Flexibilidad en consultas**: Los clientes solicitan exactamente los datos que necesitan
- ✅ **Reducción de over-fetching**: No se transfieren datos innecesarios
- ✅ **Agregación de datos**: Combina múltiples endpoints REST en una sola query
- ✅ **Tipado fuerte**: Schema GraphQL autogenerado con TypeScript
- ✅ **Versionado simplificado**: Evolución del schema sin romper clientes existentes

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────┐
│   Cliente   │
│  (Browser)  │
└──────┬──────┘
       │
       │ GraphQL Queries/Mutations
       ▼
┌─────────────────────────────────┐
│   GraphQL Gateway (NestJS)      │
│   Puerto: 3002                  │
│   ┌──────────────────────────┐  │
│   │  Apollo Server           │  │
│   │  + GraphQL Resolvers     │  │
│   └───────────┬──────────────┘  │
└───────────────┼─────────────────┘
                │
                │ HTTP Requests (HttpService/Axios)
                ▼
┌─────────────────────────────────┐
│   API REST (NestJS)             │
│   Puerto: 3001                  │
│   ┌──────────────────────────┐  │
│   │  Controllers + Services  │  │
│   └───────────┬──────────────┘  │
└───────────────┼─────────────────┘
                │
                │ TypeORM
                ▼
┌─────────────────────────────────┐
│   Base de Datos PostgreSQL      │
│   (Entidades + Relaciones)      │
└─────────────────────────────────┘
```

### Flujo de Datos

1. **Cliente → GraphQL Gateway**: Envía una query/mutation GraphQL
2. **GraphQL Resolver**: Procesa la solicitud y determina los datos necesarios
3. **HTTP Service**: Realiza llamadas HTTP al servicio REST
4. **API REST**: Procesa la solicitud y consulta la base de datos
5. **Respuesta**: Los datos fluyen de vuelta al cliente en formato GraphQL

---

## 🛠️ Tecnologías Utilizadas

### GraphQL Gateway (Puerto 3002)
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **NestJS** | 11.0.1 | Framework backend progresivo |
| **Apollo Server** | 5.0.0 | Servidor GraphQL |
| **GraphQL** | 16.11.0 | Lenguaje de consulta de APIs |
| **@nestjs/graphql** | 13.2.0 | Integración NestJS-GraphQL |
| **@nestjs/axios** | 4.0.1 | Cliente HTTP para consumir REST API |
| **RxJS** | 7.8.2 | Programación reactiva |
| **TypeScript** | 5.7.3 | Tipado estático |

### API REST (Puerto 3001)
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **NestJS** | 11.x | Framework backend |
| **TypeORM** | - | ORM para base de datos |
| **PostgreSQL** | - | Base de datos relacional |
| **Swagger** | - | Documentación API REST |
| **class-validator** | - | Validación de DTOs |

---

## 📁 Estructura del Proyecto

### GraphQL Gateway
```
gym-graphql/
├── src/
│   ├── app.module.ts              # Módulo raíz de la aplicación
│   ├── main.ts                    # Punto de entrada (Puerto 3002)
│   ├── schema.gql                 # Schema GraphQL autogenerado
│   │
│   ├── types/                     # GraphQL Object Types
│   │   ├── user.type.ts
│   │   ├── coach.type.ts
│   │   ├── gym-classes.type.ts
│   │   ├── equipment.type.ts
│   │   ├── room.type.ts
│   │   ├── schedule.type.ts
│   │   ├── plan.type.ts
│   │   ├── membership.type.ts
│   │   ├── payment.type.ts
│   │   ├── class-enrollment.type.ts
│   │   └── stats.type.ts
│   │
│   ├── inputs/                    # GraphQL Input Types
│   │   ├── user.input.ts          # CreateUserInput, UpdateUserInput
│   │   ├── plan.input.ts
│   │   ├── membership.input.ts
│   │   └── ...
│   │
│   ├── user/                      # Módulo de usuarios
│   │   ├── user.module.ts
│   │   ├── user.resolver.ts       # GraphQL Resolver
│   │   └── user-http.service.ts   # Comunicación con REST API
│   │
│   ├── plan/                      # Módulo de planes
│   ├── membership/                # Módulo de membresías
│   ├── payment/                   # Módulo de pagos
│   ├── class-enrollment/          # Módulo de inscripciones
│   ├── room/                      # Módulo de salas
│   ├── schedule/                  # Módulo de horarios
│   ├── gym-classes/               # Módulo de clases
│   ├── coach/                     # Módulo de entrenadores
│   ├── equipment/                 # Módulo de equipamiento
│   ├── stats/                     # Módulo de estadísticas
│   │   ├── stats.resolver.ts      # Queries de análisis y métricas
│   │   └── stats.module.ts
│   │
│   └── common/                    # Recursos compartidos
│       └── enums.ts               # Enums (UserRole, MembershipStatus, etc.)
│
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md                      # Este archivo
```

### API REST
```
gym-rest/
├── src/
│   ├── main.ts                    # Punto de entrada (Puerto 3001)
│   ├── app.module.ts
│   ├── user/
│   │   ├── entities/user.entity.ts
│   │   ├── dto/create-user.dto.ts
│   │   ├── user.controller.ts
│   │   └── user.service.ts
│   ├── plan/
│   ├── membership/
│   ├── payment/
│   ├── class_enrollment/
│   ├── room/
│   ├── schedule/
│   ├── gym-class/
│   ├── coach/
│   └── equiptment/
└── ...
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js**: v18+ 
- **npm**: v9+
- **PostgreSQL**: v14+ (para la API REST)
- **Git**: Para clonar el repositorio

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/JhonnyCCM/Repo-grupal-servidores-web.git
cd Repo-grupal-servidores-web
```

### Paso 2: Instalar Dependencias

#### API REST (Actividad 4)
```bash
cd actividad4_15-10/gym-rest
npm install
```

#### GraphQL Gateway (Actividad 5)
```bash
cd ../../actividad5_22-10/gym-graphql
npm install
```

### Paso 3: Configurar Variables de Entorno

#### API REST (.env)
```bash
# actividad4_15-10/gym-rest/.env
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_password
DATABASE_NAME=gym_db

CORS_ORIGIN=http://localhost:3000,http://localhost:3002
SWAGGER_TITLE=Gym REST API
SWAGGER_VERSION=1.0
```

#### GraphQL Gateway
El GraphQL Gateway no requiere archivo `.env` por defecto, pero puedes crear uno si necesitas configuraciones personalizadas.

### Paso 4: Configurar Base de Datos

```bash
# Crear base de datos PostgreSQL
createdb gym_db

# Las migraciones se ejecutan automáticamente al iniciar la API REST
```

---

## ▶️ Ejecución de Servicios

### IMPORTANTE: Orden de Ejecución

**Debes iniciar los servicios en este orden:**

### 1️⃣ Iniciar API REST (PRIMERO)

```bash
cd actividad4_15-10/gym-rest
npm run start:dev
```

✅ **Verificar que esté corriendo:**
- URL: http://localhost:3001
- Swagger: http://localhost:3001/api

### 2️⃣ Iniciar GraphQL Gateway (SEGUNDO)

```bash
cd actividad5_22-10/gym-graphql
npm run start:dev
```

✅ **Verificar que esté corriendo:**
- GraphQL Playground: http://localhost:3002/graphql
- Schema generado: `src/schema.gql`

### Verificación de Servicios

**Terminal 1 (REST API):**
```
🚀 Application is running on: http://localhost:3001
📚 Swagger documentation available at: http://localhost:3001/api
🌍 Environment: development
```

**Terminal 2 (GraphQL Gateway):**
```
🚀 GraphQL Gateway running on http://localhost:3002/graphql
🎮 GraphQL Playground available at http://localhost:3002/graphql
🌍 Environment: development
```

### Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run start:dev

# Producción
npm run build
npm run start:prod

# Tests
npm run test
npm run test:e2e
npm run test:cov

# Linting
npm run lint
npm run format
```

---

## 📚 Documentación de Queries

El proyecto implementa **queries complejas** distribuidas en tres categorías según los requisitos del taller.

### Categoría 1: Consultas de Información Agregada (3 queries)

Queries que combinan datos de múltiples entidades con Field Resolvers.

#### 1.1 `dashboardSummary` - Dashboard General del Gimnasio

**Descripción**: Combina información de usuarios, entrenadores, clases y equipamiento en un resumen ejecutivo.

**Argumentos**: Ninguno

**Retorna**: String con resumen agregado

**Entidades involucradas**: User, Coach, GymClass, Equipment

**Ejemplo:**
```graphql
query {
  dashboardSummary
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "dashboardSummary": "Dashboard Summary: 45 active users, 12 active coaches, 18 active classes, 67 available equipment. Total entities: 142"
  }
}
```

**Field Resolvers implementados:**
- `Membership.user` → Resuelve el usuario de una membresía
- `Membership.plan` → Resuelve el plan de una membresía
- `Payment.user` → Resuelve el usuario de un pago
- `Payment.membership` → Resuelve la membresía de un pago
- `ClassEnrollment.user` → Resuelve el usuario inscrito
- `ClassEnrollment.gymClass` → Resuelve la clase
- `GymClass.coach` → Resuelve el entrenador de la clase

#### 1.2 Membresías Activas con Relaciones

**Query:**
```graphql
query {
  activeMemberships {
    id
    status
    startDate
    endDate
    user {
      id
      name
      email
      role
    }
    plan {
      id
      name
      price
      durationInMonths
      features
    }
  }
}
```

**Propósito de negocio**: Vista unificada de membresías activas con detalles completos de usuarios y planes.

#### 1.3 Inscripciones con Detalles Completos

**Query:**
```graphql
query {
  classEnrollments {
    id
    enrollmentDate
    user {
      name
      email
    }
    gymClass {
      name
      description
      difficulty
      coach {
        name
        specialty
      }
    }
  }
}
```

**Propósito de negocio**: Información agregada de inscripciones mostrando usuario, clase y entrenador en una sola consulta.

---

### Categoría 2: Consultas de Análisis y Métricas (3 queries)

Queries con cálculos estadísticos y KPIs del negocio.

#### 2.1 `userStats` - Estadísticas de Usuarios

**Descripción**: Calcula métricas agregadas sobre usuarios del gimnasio.

**Argumentos**: Ninguno

**Retorna**: `UserStats`

**Propósito de negocio**: KPI para análisis demográfico y gestión de usuarios.

**Ejemplo:**
```graphql
query {
  userStats {
    totalUsers
    activeUsers
    inactiveUsers
    adminUsers
    regularUsers
    coachUsers
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "userStats": {
      "totalUsers": 150,
      "activeUsers": 132,
      "inactiveUsers": 18,
      "adminUsers": 3,
      "regularUsers": 135,
      "coachUsers": 12
    }
  }
}
```

#### 2.2 `classStats` - Estadísticas de Clases

**Query:**
```graphql
query {
  classStats {
    totalClasses
    activeClasses
    beginnerClasses
    intermediateClasses
    advancedClasses
    classesWithoutCoach
  }
}
```

**Propósito de negocio**: Análisis de oferta de clases por dificultad y disponibilidad de entrenadores.

#### 2.3 `paymentStats` - Análisis de Pagos

**Query:**
```graphql
query {
  paymentStats
}
```

**Propósito de negocio**: Métricas financieras para análisis de ingresos y morosidad.

---

### Categoría 3: Consultas de Búsqueda Avanzada (3 queries)

Queries con filtros complejos y parámetros de búsqueda.

#### 3.1 `plansByPriceRange` - Búsqueda de Planes por Precio

**Descripción**: Filtra planes dentro de un rango de precios específico.

**Argumentos**:
- `minPrice`: Float (requerido)
- `maxPrice`: Float (requerido)

**Ejemplo:**
```graphql
query {
  plansByPriceRange(minPrice: 30.0, maxPrice: 100.0) {
    id
    name
    price
    durationInMonths
    features
    isActive
  }
}
```

**Propósito de negocio**: Ayuda a los clientes a encontrar planes dentro de su presupuesto.

#### 3.2 `completedPayments` vs `pendingPayments` - Filtros por Estado

**Query:**
```graphql
query {
  completed: completedPayments {
    id
    amount
    transactionId
    paidAt
    user {
      name
    }
  }
  
  pending: pendingPayments {
    id
    amount
    status
    user {
      name
      email
    }
  }
}
```

**Propósito de negocio**: Gestión de cobranza y seguimiento de pagos pendientes.

#### 3.3 `enrollmentsByUser` / `enrollmentsByClass` - Filtros Parametrizados

**Query:**
```graphql
query {
  # Inscripciones de un usuario específico
  userEnrollments: enrollmentsByUser(userId: "uuid-del-usuario") {
    enrollmentDate
    gymClass {
      name
      difficulty
      coach {
        name
      }
    }
  }
  
  # Participantes de una clase
  classParticipants: enrollmentsByClass(classId: "uuid-de-la-clase") {
    user {
      name
      email
    }
    enrollmentDate
  }
}
```

**Propósito de negocio**: Gestión de inscripciones y planificación de clases.

---

## 📖 Ejemplos de Uso

### Ejemplo 1: Crear un Plan de Membresía

```graphql
mutation {
  createPlan(createPlanInput: {
    name: "Plan Premium Anual"
    description: "Acceso completo con beneficios exclusivos"
    price: 599.99
    durationInMonths: 12
    features: [
      "Acceso ilimitado 24/7",
      "Clases grupales incluidas",
      "Entrenador personal 2 veces/semana",
      "Acceso a zona VIP",
      "Descuento en tienda"
    ]
    isActive: true
  }) {
    id
    name
    price
    durationInMonths
  }
}
```

### Ejemplo 2: Consultar Planes Activos

```graphql
query {
  activePlans {
    id
    name
    price
    durationInMonths
    features
  }
}
```

### Ejemplo 3: Crear Membresía para un Usuario

```graphql
mutation {
  createMembership(createMembershipInput: {
    userId: "uuid-del-usuario"
    planId: "uuid-del-plan"
    status: ACTIVE
    startDate: "2025-01-01"
    endDate: "2026-01-01"
  }) {
    id
    status
    user {
      name
      email
    }
    plan {
      name
      price
    }
  }
}
```

### Ejemplo 4: Dashboard Ejecutivo

```graphql
query {
  # Resumen general
  summary: dashboardSummary
  
  # Métricas de usuarios
  users: userStats {
    totalUsers
    activeUsers
  }
  
  # Métricas de clases
  classes: classStats {
    totalClasses
    activeClasses
  }
  
  # Equipamiento disponible
  equipment: equipmentStats {
    totalEquipment
    availableEquipment
    maintenanceEquipment
  }
}
```

### Ejemplo 5: Análisis de Ingresos

```graphql
query {
  # Pagos completados
  completedPayments {
    amount
    method
    paidAt
    user {
      name
    }
  }
  
  # Estadísticas de pagos
  paymentStats
}
```

---

## 👥 Equipo y Distribución del Trabajo

### Integrante 1: Consultas de Información Agregada
**Responsable**: [Nombre del Integrante 1]

**Tareas completadas**:
- ✅ Implementación de Field Resolvers en módulos de Membership, Payment, ClassEnrollment
- ✅ Query `dashboardSummary` combinando múltiples entidades
- ✅ Query `activeMemberships` con relaciones User y Plan
- ✅ Documentación de tipos de respuesta complejos

**Archivos modificados**:
- `src/membership/membership.resolver.ts`
- `src/payment/payment.resolver.ts`
- `src/class-enrollment/class-enrollment.resolver.ts`
- `src/stats/stats.resolver.ts`

### Integrante 2: Consultas de Análisis y Métricas
**Responsable**: [Nombre del Integrante 2]

**Tareas completadas**:
- ✅ Implementación de `userStats` con cálculos agregados
- ✅ Implementación de `classStats` con análisis de dificultad
- ✅ Implementación de `equipmentStats` 
- ✅ Query `paymentStats` con métricas financieras

**Archivos modificados**:
- `src/stats/stats.resolver.ts`
- `src/types/stats.type.ts`
- `src/payment/payment.resolver.ts`

### Integrante 3: Consultas de Búsqueda Avanzada
**Responsable**: [Nombre del Integrante 3]

**Tareas completadas**:
- ✅ Implementación de filtros en `plansByPriceRange`
- ✅ Queries con filtros de estado: `completedPayments`, `pendingPayments`
- ✅ Búsquedas parametrizadas: `enrollmentsByUser`, `enrollmentsByClass`
- ✅ Input Types con múltiples criterios de filtrado

**Archivos modificados**:
- `src/plan/plan.resolver.ts`
- `src/payment/payment.resolver.ts`
- `src/class-enrollment/class-enrollment.resolver.ts`
- `src/inputs/*.input.ts`

### Coordinación del Equipo

**Acuerdos iniciales**:
- Uso de tipos GraphQL compartidos (Object Types en `src/types/`)
- Convención de nombres para queries y mutations
- Estructura modular con HttpService para cada entidad
- Manejo consistente de errores con try-catch
- Uso de Observables (RxJS) para operaciones asíncronas

---

## 📅 Planificación del Proyecto

### Acta de Reunión Inicial

**Fecha**: [Fecha de inicio del proyecto]  
**Participantes**: [Integrante 1, Integrante 2, Integrante 3]

**Acuerdos tomados**:
1. Estructura de carpetas modular por entidad
2. Separación de responsabilidades: types, inputs, resolvers, http-services
3. Uso de enums compartidos en `src/common/enums.ts`
4. Puerto 3002 para GraphQL Gateway, Puerto 3001 para REST API
5. Implementación de Field Resolvers para relaciones entre entidades
6. Autogeneración del schema GraphQL con Code-First approach

### Distribución de las 9 Queries

| # | Query | Tipo | Integrante | Propósito de Negocio |
|---|-------|------|------------|----------------------|
| 1 | `dashboardSummary` | Agregación | 1 | Dashboard ejecutivo con resumen general |
| 2 | `activeMemberships` + Field Resolvers | Agregación | 1 | Vista unificada de membresías activas |
| 3 | `classEnrollments` + Field Resolvers | Agregación | 1 | Información completa de inscripciones |
| 4 | `userStats` | Métricas | 2 | KPI de usuarios activos/inactivos |
| 5 | `classStats` | Métricas | 2 | Análisis de oferta de clases |
| 6 | `paymentStats` | Métricas | 2 | Métricas financieras y de cobranza |
| 7 | `plansByPriceRange` | Búsqueda | 3 | Filtro de planes por presupuesto |
| 8 | `completedPayments` / `pendingPayments` | Búsqueda | 3 | Gestión de pagos por estado |
| 9 | `enrollmentsByUser` / `enrollmentsByClass` | Búsqueda | 3 | Búsquedas parametrizadas de inscripciones |

### Cronograma de Trabajo

| Semana | Actividades | Responsable |
|--------|-------------|-------------|
| Semana 1 | Setup inicial del proyecto, configuración de módulos base | Todos |
| Semana 2 | Implementación de tipos GraphQL y HTTP services | Todos |
| Semana 2-3 | Desarrollo de queries asignadas por integrante | Individual |
| Semana 3 | Testing de queries en Apollo Playground | Todos |
| Semana 4 | Documentación y preparación de entregables | Todos |
| Semana 4 | Revisión final y presentación | Todos |

---

## 🔧 Consideraciones Técnicas

### Manejo de Errores

```typescript
// Ejemplo de manejo robusto de errores
async findOne(id: string): Promise<Plan> {
  try {
    const response = await firstValueFrom(
      this.httpService.get(`${this.restUrl}/${id}`)
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new NotFoundException(`Plan ${id} no encontrado`);
    }
    throw new InternalServerErrorException('Error al consultar servicio REST');
  }
}
```

### Optimización de Consultas

- **RxJS Observables**: Uso de `map`, `catchError`, `forkJoin` para operaciones reactivas
- **Field Resolvers**: Carga lazy de relaciones solo cuando se solicitan
- **HTTP Service**: Conexión persistente con el servicio REST mediante Axios

### CORS y Seguridad

El GraphQL Gateway acepta conexiones de:
- Frontend local: `http://localhost:3000`
- Otros orígenes configurables

---

## 📊 Schema GraphQL Autogenerado

El schema se genera automáticamente en `src/schema.gql` basado en los decoradores TypeScript.

**Entidades principales**:
- User, Coach
- GymClass, Equipment
- Room, Schedule
- Plan, Membership, Payment
- ClassEnrollment
- UserStats, ClassStats, EquipmentStats

**Enums**:
- UserRole: `ADMIN | USER | COACH`
- MembershipStatus: `ACTIVE | INACTIVE | SUSPENDED | EXPIRED`
- PaymentStatus: `PENDING | COMPLETED | FAILED | REFUNDED`
- PaymentMethod: `CREDIT_CARD | DEBIT_CARD | CASH | BANK_TRANSFER`
- DifficultyLevel: `BEGINNER | INTERMEDIATE | ADVANCED`
- EquipmentStatus: `DISPONIBLE | EN_USO | MANTENIMIENTO | FUERA_DE_SERVICIO`

---

## 🧪 Testing

### Probar en Apollo Playground

1. Abrir http://localhost:3002/graphql
2. Ejecutar queries de ejemplo
3. Verificar respuestas y relaciones

### Ejemplo de Test Manual

```graphql
# 1. Crear un plan
mutation {
  createPlan(createPlanInput: {
    name: "Plan Test"
    price: 50.0
    durationInMonths: 1
    isActive: true
  }) {
    id
    name
  }
}

# 2. Listar planes activos
query {
  activePlans {
    id
    name
    price
  }
}

# 3. Verificar estadísticas
query {
  dashboardSummary
}
```

---

## 📝 Notas Importantes

### Problemas Conocidos y Soluciones

1. **Error "Validation failed (numeric string is expected)"**
   - **Causa**: ParseIntPipe en controladores REST con parámetros opcionales
   - **Solución**: Convertir parámetros a string y parsear manualmente

2. **Error de serialización de DateTime**
   - **Causa**: Campos `Date` no compatibles con serialización GraphQL
   - **Solución**: Cambiar a `string` con formato ISO 8601

3. **Puerto en uso (EADDRINUSE)**
   - **Solución**: Verificar que REST API esté en 3001 y GraphQL en 3002

### Mejoras Futuras

- [ ] Implementar paginación en queries que retornan listas
- [ ] Agregar autenticación y autorización (JWT)
- [ ] Implementar DataLoader para optimizar N+1 queries
- [ ] Agregar subscriptions GraphQL para actualizaciones en tiempo real
- [ ] Implementar caché con Redis
- [ ] Tests unitarios y de integración

---

## 📞 Soporte y Contacto

**Repositorio**: https://github.com/JhonnyCCM/Repo-grupal-servidores-web

**Equipo de Desarrollo**:
- [Integrante 1] - [email]
- [Integrante 2] - [email]
- [Integrante 3] - [email]

---

## 📄 Licencia

Este proyecto es de uso educativo para el curso de Aplicaciones Servidor.

---

## 🙏 Agradecimientos

- **NestJS** - Framework de desarrollo
- **Apollo GraphQL** - Servidor GraphQL
- **TypeORM** - ORM para PostgreSQL
- Equipo docente del curso

---

**Última actualización**: Octubre 22, 2025
