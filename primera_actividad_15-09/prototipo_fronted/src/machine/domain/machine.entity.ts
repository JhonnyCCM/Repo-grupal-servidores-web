export interface Machine {
  id: number
  name: string
  description: string
  image: string
  muscle_group: string
  status: 'Disponible' | 'En Mantenimiento' | 'Ocupada'
}
