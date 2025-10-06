export interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  cardHolder: string;
  expiryDate: string; // Formato "MM/YY"
    brand: string; // Marca de la tarjeta (Visa, MasterCard, etc.)
    isDefault: boolean; // Indica si es el método de pago predeterminado
    createdAt: Date;
    updatedAt: Date;
    billingAddress?: {
        line1: string;
        line2?: string;
        city: string;
        state?: string;
        postalCode: string;
        country: string;
    };
    isVerified: boolean; // Indica si el método de pago ha sido verificado
    usageCount: number; // Número de veces que se ha utilizado este método de pago
    linkedSubscriptions: string[]; // IDs de suscripciones vinculadas a este método de pago

}