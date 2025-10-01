export interface Class {
  id: number
  name: string
  description: string
  image: string
  duration: number // in minutes
  difficulty: 'Baja' | 'Media' | 'Alta'
}
