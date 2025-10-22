export enum DifficultyLevel {
  BEGINNER = 'Principiante',
  INTERMEDIATE = 'Intermedio',
  ADVANCED = 'Avanzado',
}

export enum Status {
  ACTIVE = 'Disponible', 
  INACTIVE = 'No disponible',
  MAINTENANCE = 'En mantenimiento',
}

export enum MembershipStatus {
  ACTIVE = 'Activa',
  INACTIVE = 'Inactiva',
  EXPIRED = 'Expirada',
}

export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    CASH = 'cash',
    BANK_TRANSFER = 'bank_transfer',
    PAYPAL = 'paypal',
    STRIPE = 'stripe',
    MERCADOPAGO = 'mercadopago'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  COACH = 'coach',
}

export enum PaymentStatus {
  PENDING = 'Pendiente',
  COMPLETED = 'Completado',
  FAILED = 'Fallido',
  REFUNDED = 'Reembolsado',
}