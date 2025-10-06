export interface Routine {
  id: string;
  name: string;
  description: string;
  coachId: string;
  userId: string;
  steps: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
}