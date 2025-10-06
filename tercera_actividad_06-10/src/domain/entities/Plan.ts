export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
    features: string[];
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    imageUrl?: string;
    stripePriceId: string;
    stripeProductId: string;
    isPopular: boolean;
    isTrial: boolean;
    trialDays?: number;
    maxUsers?: number; // Máximo número de usuarios que pueden suscribirse a este plan (opcional)
    maxClassesPerMonth?: number; // Máximo número de clases al mes (opcional)
    maxMachineAccess?: number; // Máximo número de accesos a máquinas (opcional)
    maxCoachSessions?: number; // Máximo número de sesiones con coach (opcional)
    priorityLevel: number; // Nivel de prioridad para mostrar en la UI (1 = más alto)
    isCustom: boolean; // Indica si el plan es personalizado
    customFeatures?: string[]; // Características personalizadas (si es un plan personalizado)
    isGiftable: boolean; // Indica si el plan puede ser regalado
    giftableToPlans?: string[]; // IDs de planes a los que se puede regalar este plan (si es regalable)
    renewalDiscountPercent?: number; // Descuento en porcentaje para renovaciones (opcional)
    cancellationPolicy?: string; // Política de cancelación del plan (opcional)
    promotionalText?: string; // Texto promocional para destacar el plan (opcional)
    termsAndConditionsUrl?: string; // URL a los términos y condiciones del plan (opcional)
    isVisibleInStore: boolean; // Indica si el plan es visible en la tienda
    isVisibleInAdmin: boolean; // Indica si el plan es visible en el panel de administración
    metadata?: Record<string, any>; // Metadatos adicionales para el plan (opcional)
    tags?: string[]; // Etiquetas para categorizar el plan (opcional)
    categories?: string[]; // Categorías a las que pertenece el plan (opcional)
    availableFrom?: Date; // Fecha desde la cual el plan está disponible (opcional)
    availableTo?: Date; // Fecha hasta la cual el plan está disponible (opcional)
    regionRestrictions?: string[]; // Restricciones por región (opcional)
    languageOptions?: string[]; // Opciones de idioma para el plan (opcional)
    supportContact?: string; // Contacto de soporte para este plan (opcional)
    faqsUrl?: string; // URL a las preguntas frecuentes del plan (opcional)
    onboardingGuideUrl?: string; // URL a la guía de incorporación para este plan (opcional)
    upgradePath?: string[]; // IDs de planes a los que se puede actualizar desde este plan (opcional)
    downgradePath?: string[]; // IDs de planes a los que se puede degradar desde este plan (opcional)
    isFamilyPlan: boolean; // Indica si el plan es un plan familiar
    maxFamilyMembers?: number; // Máximo número de miembros en un plan familiar (opcional)
    familyMemberPrice?: number; // Precio adicional por miembro en un plan familiar (opcional)
    familyMemberFeatures?: string[]; // Características específicas para miembros en un plan familiar (opcional)
    
}