# 🚀 Comandos Útiles - GraphQL Gym API

## 📋 Comandos para Desarrollo

### Iniciar Servicios

#### 1. Servicio REST (Puerto 3001)
```bash
cd "C:\Users\jonni\Desktop\5to\aplicaciones servidor\Repo-grupal-servidores-web\actividad4_15-10\gym-rest"
npm run start:dev
```

#### 2. Servicio GraphQL (Puerto 3000)
```bash
cd "C:\Users\jonni\Desktop\5to\aplicaciones servidor\Repo-grupal-servidores-web\actividad5_22-10\gym-graphql"
npm run start:dev
```

---

## 🧪 Testing con Apollo Playground

### URL del Playground
```
http://localhost:3000/graphql
```

### Queries de Prueba Rápida

#### 1️⃣ Verificar Salas
```graphql
query {
  rooms {
    id
    name
    capacity
    description
  }
}
```

#### 2️⃣ Verificar Horarios
```graphql
query {
  schedules {
    id
    name
    startTime
    endTime
  }
}
```

#### 3️⃣ Verificar Planes
```graphql
query {
  plans {
    id
    name
    price
    durationInMonths
    features
    isActive
  }
}
```

#### 4️⃣ Verificar Membresías con Relaciones
```graphql
query {
  memberships {
    id
    status
    startDate
    endDate
    user {
      id
      firstName
      lastName
      email
    }
    plan {
      id
      name
      price
    }
  }
}
```

#### 5️⃣ Verificar Pagos con Relaciones
```graphql
query {
  payments {
    id
    amount
    method
    status
    paidAt
    user {
      firstName
      lastName
    }
    membership {
      plan {
        name
      }
    }
  }
}
```

#### 6️⃣ Verificar Inscripciones a Clases
```graphql
query {
  classEnrollments {
    id
    enrollmentDate
    user {
      firstName
      lastName
    }
    gymClass {
      name
      difficultyLevel
      coach {
        firstName
        lastName
      }
    }
  }
}
```

---

## 🏗️ Comandos de Creación

### Crear Sala
```graphql
mutation {
  createRoom(createRoomInput: {
    name: "Sala de Spinning"
    description: "Sala equipada con 20 bicicletas estáticas"
    capacity: 20
  }) {
    id
    name
    capacity
  }
}
```

### Crear Horario
```graphql
mutation {
  createSchedule(createScheduleInput: {
    name: "Mañana"
    startTime: "2025-01-01T08:00:00Z"
    endTime: "2025-01-01T10:00:00Z"
  }) {
    id
    name
    startTime
    endTime
  }
}
```

### Crear Plan
```graphql
mutation {
  createPlan(createPlanInput: {
    name: "Plan Básico"
    description: "Acceso a clases básicas"
    price: 49.99
    durationInMonths: 1
    features: ["3 clases por semana", "Acceso vestuario"]
  }) {
    id
    name
    price
    isActive
  }
}
```

### Crear Membresía
```graphql
mutation {
  createMembership(createMembershipInput: {
    userId: "REEMPLAZAR-CON-UUID-REAL"
    planId: "REEMPLAZAR-CON-UUID-REAL"
    startDate: "2025-01-01"
    endDate: "2025-02-01"
    status: ACTIVE
  }) {
    id
    status
    user {
      firstName
      lastName
    }
    plan {
      name
      price
    }
  }
}
```

### Crear Pago
```graphql
mutation {
  createPayment(createPaymentInput: {
    userId: "REEMPLAZAR-CON-UUID-REAL"
    membershipId: "REEMPLAZAR-CON-UUID-REAL"
    method: CREDIT_CARD
    amount: 49.99
    status: COMPLETED
  }) {
    id
    amount
    method
    status
  }
}
```

### Crear Inscripción a Clase
```graphql
mutation {
  createClassEnrollment(createClassEnrollmentInput: {
    userId: "REEMPLAZAR-CON-UUID-REAL"
    classId: "REEMPLAZAR-CON-UUID-REAL"
    enrollmentDate: "2025-01-15"
  }) {
    id
    enrollmentDate
    user {
      firstName
      lastName
    }
    gymClass {
      name
      coach {
        firstName
        lastName
      }
    }
  }
}
```

---

## 🔍 Queries Complejas

### Planes por Rango de Precio
```graphql
query {
  plansByPriceRange(minPrice: 30, maxPrice: 100) {
    id
    name
    price
    durationInMonths
  }
}
```

### Salas Disponibles con Capacidad Mínima
```graphql
query {
  availableRooms(minCapacity: 15) {
    id
    name
    capacity
    description
  }
}
```

### Membresías Activas
```graphql
query {
  activeMemberships {
    id
    user {
      firstName
      lastName
      email
    }
    plan {
      name
      price
    }
    startDate
    endDate
  }
}
```

### Pagos Pendientes
```graphql
query {
  pendingPayments {
    id
    amount
    method
    user {
      firstName
      lastName
    }
    membership {
      plan {
        name
      }
    }
  }
}
```

### Inscripciones por Usuario
```graphql
query {
  enrollmentsByUser(userId: "REEMPLAZAR-CON-UUID-REAL") {
    id
    enrollmentDate
    gymClass {
      name
      difficultyLevel
      coach {
        firstName
        lastName
        specialities
      }
      room {
        name
        capacity
      }
      schedule {
        name
        startTime
        endTime
      }
    }
  }
}
```

### Inscripciones por Clase
```graphql
query {
  enrollmentsByClass(classId: "REEMPLAZAR-CON-UUID-REAL") {
    id
    enrollmentDate
    user {
      firstName
      lastName
      email
    }
  }
}
```

---

## 📊 Estadísticas

### Estadísticas de Usuarios
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

### Estadísticas de Clases
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

### Estadísticas de Equipos
```graphql
query {
  equipmentStats {
    totalEquipment
    availableEquipment
    inactiveEquipment
    maintenanceEquipment
  }
}
```

### Dashboard Completo
```graphql
query {
  dashboardSummary
  userStats {
    totalUsers
    activeUsers
  }
  classStats {
    totalClasses
    activeClasses
  }
  equipmentStats {
    totalEquipment
    availableEquipment
  }
}
```

---

## 🔄 Actualización y Eliminación

### Actualizar Sala
```graphql
mutation {
  updateRoom(
    id: "REEMPLAZAR-CON-UUID-REAL"
    updateRoomInput: {
      name: "Sala de Yoga Renovada"
      capacity: 25
    }
  ) {
    id
    name
    capacity
  }
}
```

### Actualizar Membresía
```graphql
mutation {
  updateMembership(
    id: "REEMPLAZAR-CON-UUID-REAL"
    updateMembershipInput: {
      status: EXPIRED
    }
  ) {
    id
    status
    endDate
  }
}
```

### Actualizar Pago
```graphql
mutation {
  updatePayment(
    id: "REEMPLAZAR-CON-UUID-REAL"
    updatePaymentInput: {
      status: COMPLETED
      paidAt: "2025-01-15T10:30:00Z"
    }
  ) {
    id
    status
    paidAt
  }
}
```

### Eliminar Inscripción
```graphql
mutation {
  removeClassEnrollment(id: "REEMPLAZAR-CON-UUID-REAL")
}
```

---

## 🎯 Variables en Queries

### Usando Variables
```graphql
# Query
query GetMembershipsByUser($userId: ID!) {
  membershipsByUser(userId: $userId) {
    id
    status
    plan {
      name
      price
    }
  }
}

# Variables (pestaña Query Variables)
{
  "userId": "REEMPLAZAR-CON-UUID-REAL"
}
```

### Query con Múltiples Variables
```graphql
query GetPlansByPriceRange($min: Float!, $max: Float!) {
  plansByPriceRange(minPrice: $min, maxPrice: $max) {
    id
    name
    price
    durationInMonths
  }
}

# Variables
{
  "min": 30.0,
  "max": 100.0
}
```

---

## 🐛 Debugging

### Verificar Schema
```graphql
query {
  __schema {
    types {
      name
      kind
    }
  }
}
```

### Ver Tipos Disponibles
```graphql
query {
  __type(name: "Membership") {
    name
    fields {
      name
      type {
        name
        kind
      }
    }
  }
}
```

---

## 📝 Filtros Avanzados

### Filtrar Usuarios
```graphql
query {
  users(filter: {
    search: "john"
    role: "USER"
    isActive: true
  }) {
    id
    firstName
    lastName
    email
    role
  }
}
```

### Filtrar Clases
```graphql
query {
  gymClasses(filter: {
    difficultyLevel: BEGINNER
    isActive: true
    search: "yoga"
  }) {
    id
    name
    difficultyLevel
    coach {
      firstName
      lastName
    }
  }
}
```

### Filtrar Pagos
```graphql
query {
  payments(filter: {
    status: PENDING
    method: CREDIT_CARD
  }) {
    id
    amount
    status
    method
    user {
      firstName
      lastName
    }
  }
}
```

---

## 💡 Tips Útiles

### 1. Obtener IDs reales primero
```graphql
# Primero obtén los IDs
query {
  users { id firstName }
  plans { id name }
  gymClasses { id name }
}

# Luego úsalos en mutations
```

### 2. Usar Fragmentos
```graphql
fragment UserInfo on User {
  id
  firstName
  lastName
  email
}

query {
  activeUsers {
    ...UserInfo
  }
  usersByRole(role: "COACH") {
    ...UserInfo
  }
}
```

### 3. Aliases para Múltiples Queries
```graphql
query {
  basicPlans: plansByPriceRange(minPrice: 0, maxPrice: 50) {
    id
    name
    price
  }
  premiumPlans: plansByPriceRange(minPrice: 50, maxPrice: 200) {
    id
    name
    price
  }
}
```

---

## 🔗 URLs Importantes

- **Apollo Playground**: http://localhost:3000/graphql
- **REST API**: http://localhost:3001
- **Schema GraphQL**: `src/schema.gql`

---

## 📚 Documentación

- `NUEVAS_ENTIDADES.md` - Documentación detallada de nuevas entidades
- `RESUMEN_IMPLEMENTACION.md` - Resumen completo del proyecto
- `README.md` - Documentación general del proyecto

---

**¡Listo para usar!** 🚀✨
