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
    stripePriceId: string;
    stripeProductId: string;
}