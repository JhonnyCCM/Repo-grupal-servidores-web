# Nuevas Entidades Agregadas al Proyecto GraphQL

## Resumen
Se han agregado 6 nuevas entidades al proyecto GraphQL del gimnasio, completando la funcionalidad del sistema. Estas entidades se integran con el servicio REST existente en el puerto 3001.

---

## Entidades Agregadas

### 1. **Room (Salas)**
- **Ubicación**: `src/room/`
- **Archivos**:
  - `room.type.ts` - Definición del tipo GraphQL
  - `room.input.ts` - Inputs para crear, actualizar y filtrar
  - `room-http.service.ts` - Servicio HTTP para comunicación con REST
  - `room.resolver.ts` - Resolver con queries y mutations
  - `room.module.ts` - Módulo de NestJS

**Queries disponibles:**
- `rooms(filter: FilterRoomInput)` - Listar todas las salas
- `room(id: ID!)` - Obtener una sala por ID
- `availableRooms(minCapacity: Int)` - Salas disponibles con capacidad mínima

**Mutations:**
- `createRoom(createRoomInput: CreateRoomInput!)`
- `updateRoom(id: ID!, updateRoomInput: UpdateRoomInput!)`
- `removeRoom(id: ID!)`

---

### 2. **Schedule (Horarios)**
- **Ubicación**: `src/schedule/`
- **Archivos**:
  - `schedule.type.ts`
  - `schedule.input.ts`
  - `schedule-http.service.ts`
  - `schedule.resolver.ts`
  - `schedule.module.ts`

**Queries disponibles:**
- `schedules(filter: FilterScheduleInput)` - Listar todos los horarios
- `schedule(id: ID!)` - Obtener un horario por ID

**Mutations:**
- `createSchedule(createScheduleInput: CreateScheduleInput!)`
- `updateSchedule(id: ID!, updateScheduleInput: UpdateScheduleInput!)`
- `removeSchedule(id: ID!)`

---

### 3. **Plan (Planes de Membresía)**
- **Ubicación**: `src/plan/`
- **Archivos**:
  - `plan.type.ts`
  - `plan.input.ts`
  - `plan-http.service.ts`
  - `plan.resolver.ts`
  - `plan.module.ts`

**Queries disponibles:**
- `plans(filter: FilterPlanInput)` - Listar todos los planes
- `plan(id: ID!)` - Obtener un plan por ID
- `activePlans` - Planes activos
- `plansByPriceRange(minPrice: Float!, maxPrice: Float!)` - Planes por rango de precio

**Mutations:**
- `createPlan(createPlanInput: CreatePlanInput!)`
- `updatePlan(id: ID!, updatePlanInput: UpdatePlanInput!)`
- `removePlan(id: ID!)`

---

### 4. **Membership (Membresías)**
- **Ubicación**: `src/membership/`
- **Archivos**:
  - `membership.type.ts`
  - `membership.input.ts`
  - `membership-http.service.ts`
  - `membership.resolver.ts`
  - `membership.module.ts`

**Queries disponibles:**
- `memberships(filter: FilterMembershipInput)` - Listar todas las membresías
- `membership(id: ID!)` - Obtener una membresía por ID
- `activeMemberships` - Membresías activas
- `membershipsByUser(userId: ID!)` - Membresías de un usuario
- `expiredMemberships` - Membresías expiradas

**Mutations:**
- `createMembership(createMembershipInput: CreateMembershipInput!)`
- `updateMembership(id: ID!, updateMembershipInput: UpdateMembershipInput!)`
- `removeMembership(id: ID!)`

**Relaciones:**
- `user: User` - Usuario asociado
- `plan: Plan` - Plan asociado

---

### 5. **Payment (Pagos)**
- **Ubicación**: `src/payment/`
- **Archivos**:
  - `payment.type.ts`
  - `payment.input.ts`
  - `payment-http.service.ts`
  - `payment.resolver.ts`
  - `payment.module.ts`

**Queries disponibles:**
- `payments(filter: FilterPaymentInput)` - Listar todos los pagos
- `payment(id: ID!)` - Obtener un pago por ID
- `completedPayments` - Pagos completados
- `pendingPayments` - Pagos pendientes
- `paymentsByUser(userId: ID!)` - Pagos de un usuario
- `paymentStats` - Estadísticas de pagos

**Mutations:**
- `createPayment(createPaymentInput: CreatePaymentInput!)`
- `updatePayment(id: ID!, updatePaymentInput: UpdatePaymentInput!)`
- `removePayment(id: ID!)`

**Relaciones:**
- `user: User` - Usuario que realiza el pago
- `membership: Membership` - Membresía asociada

---

### 6. **ClassEnrollment (Inscripciones a Clases)**
- **Ubicación**: `src/class-enrollment/`
- **Archivos**:
  - `class-enrollment.type.ts`
  - `class-enrollment.input.ts`
  - `class-enrollment-http.service.ts`
  - `class-enrollment.resolver.ts`
  - `class-enrollment.module.ts`

**Queries disponibles:**
- `classEnrollments(filter: FilterClassEnrollmentInput)` - Listar todas las inscripciones
- `classEnrollment(id: ID!)` - Obtener una inscripción por ID
- `enrollmentsByUser(userId: ID!)` - Inscripciones de un usuario
- `enrollmentsByClass(classId: ID!)` - Inscripciones de una clase
- `enrollmentStats` - Estadísticas de inscripciones

**Mutations:**
- `createClassEnrollment(createClassEnrollmentInput: CreateClassEnrollmentInput!)`
- `updateClassEnrollment(id: ID!, updateClassEnrollmentInput: UpdateClassEnrollmentInput!)`
- `removeClassEnrollment(id: ID!)`

**Relaciones:**
- `user: User` - Usuario inscrito
- `gymClass: GymClass` - Clase en la que está inscrito

---

## Enums Utilizados

### MembershipStatus
```graphql
enum MembershipStatus {
  ACTIVE
  INACTIVE
  EXPIRED
}
```

### PaymentMethod
```graphql
enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  CASH
  BANK_TRANSFER
  PAYPAL
  STRIPE
  MERCADOPAGO
}
```

### PaymentStatus
```graphql
enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}
```

---

## Estructura de Carpetas

Cada entidad sigue la misma estructura:
```
entidad/
├── entidad.type.ts           # Tipo GraphQL
├── entidad.input.ts          # Inputs (Create, Update, Filter)
├── entidad-http.service.ts   # Servicio HTTP
├── entidad.resolver.ts       # Resolver (Queries/Mutations)
└── entidad.module.ts         # Módulo NestJS
```

---

## Integración con app.module.ts

Todos los nuevos módulos han sido agregados al `app.module.ts`:

```typescript
import { RoomModule } from './room/room.module';
import { ScheduleModule } from './schedule/schedule.module';
import { PlanModule } from './plan/plan.module';
import { MembershipModule } from './membership/membership.module';
import { PaymentModule } from './payment/payment.module';
import { ClassEnrollmentModule } from './class-enrollment/class-enrollment.module';

@Module({
  imports: [
    // ... otros módulos
    RoomModule,
    ScheduleModule,
    PlanModule,
    MembershipModule,
    PaymentModule,
    ClassEnrollmentModule,
  ],
})
export class AppModule {}
```

---

## Cómo Usar

### 1. Iniciar el servidor REST (puerto 3001)
```bash
cd actividad4_15-10/gym-rest
npm run start:dev
```

### 2. Iniciar el servidor GraphQL (puerto 3000)
```bash
cd actividad5_22-10/gym-graphql
npm run start:dev
```

### 3. Acceder al Playground
Abrir navegador en: `http://localhost:3000/graphql`

---

## Ejemplos de Queries

### Crear una sala
```graphql
mutation {
  createRoom(createRoomInput: {
    name: "Sala Principal"
    description: "Sala amplia para clases grupales"
    capacity: 30
  }) {
    id
    name
    capacity
  }
}
```

### Listar planes activos
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

### Crear una membresía
```graphql
mutation {
  createMembership(createMembershipInput: {
    userId: "uuid-del-usuario"
    planId: "uuid-del-plan"
    startDate: "2025-01-01"
    endDate: "2025-12-31"
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

### Inscribir a un usuario en una clase
```graphql
mutation {
  createClassEnrollment(createClassEnrollmentInput: {
    userId: "uuid-del-usuario"
    classId: "uuid-de-la-clase"
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
      difficultyLevel
    }
  }
}
```

---

## Relaciones entre Entidades

```
User
├── Membership (1:N)
├── Payment (1:N)
└── ClassEnrollment (1:N)

Plan
└── Membership (1:N)

Membership
├── User (N:1)
├── Plan (N:1)
└── Payment (1:N)

Payment
├── User (N:1)
└── Membership (N:1)

GymClass
├── Coach (N:1)
├── Room (N:1)
├── Schedule (N:1)
└── ClassEnrollment (1:N)

ClassEnrollment
├── User (N:1)
└── GymClass (N:1)
```

---

## Notas Importantes

1. **Todas las entidades se comunican con el servicio REST** en `http://localhost:3001`
2. **Los resolvers incluyen relaciones** para cargar entidades relacionadas automáticamente
3. **Cada servicio HTTP maneja errores** apropiadamente con excepciones HTTP
4. **Se utilizan Observables de RxJS** para manejar las peticiones HTTP
5. **Los filtros permiten búsquedas complejas** en todas las entidades
6. **Las estadísticas están disponibles** para pagos e inscripciones

---

## Próximos Pasos Sugeridos

1. ✅ Agregar validaciones a los inputs
2. ✅ Implementar paginación para grandes conjuntos de datos
3. ✅ Agregar autenticación y autorización
4. ✅ Implementar subscriptions para actualizaciones en tiempo real
5. ✅ Agregar tests unitarios y de integración
6. ✅ Documentar el schema GraphQL generado

---

## Schema GraphQL Generado

El schema completo se encuentra en `src/schema.gql` y se regenera automáticamente al iniciar el servidor.
