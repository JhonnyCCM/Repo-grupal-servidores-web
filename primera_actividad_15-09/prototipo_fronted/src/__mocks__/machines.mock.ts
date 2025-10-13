import { Machine } from '../domain/entities/machine.entity.js'
import { Status } from '../domain/value-objects.js'

export const MOCK_MACHINES: Machine[] = [
  new Machine(
    'machine-1',
    'Cinta de Correr ProFit X1',
    'Cinta de correr profesional con inclinación automática y programas de entrenamiento',
    [
      { id: 'spec-cardio-1', name: 'Cardio', description: 'Ejercicio cardiovascular' },
      { id: 'spec-resist-1', name: 'Resistencia', description: 'Entrenamiento de resistencia' },
    ],
    new Date('2024-01-10'),
    [
      {
        id: 'room-1',
        name: 'Sala Cardio',
        description: 'Área de máquinas cardiovasculares',
        location: 'Primer Piso',
        capacity: 30,
      },
      {
        id: 'room-2',
        name: 'Sala Pesas',
        description: 'Área de entrenamiento con pesas y máquinas de fuerza',
        location: 'Segundo Piso',
        capacity: 25,
      },
    ],
    Status.ACTIVE,
    new Date('2024-01-10'),
    '/img/maquinas/caminadora.jpg',
  ),
  new Machine(
    'machine-2',
    'Banco de Pesas Olympic',
    'Banco ajustable para entrenamiento de fuerza con soporte para barras olímpicas',
    [
      { id: 'spec-fuerza-1', name: 'Fuerza', description: 'Entrenamiento de fuerza' },
      { id: 'spec-musc-1', name: 'Musculación', description: 'Desarrollo muscular' },
    ],
    new Date('2024-01-12'),
    [
      {
        id: 'room-1',
        name: 'Sala Cardio',
        description: 'Área de máquinas cardiovasculares',
        location: 'Primer Piso',
        capacity: 30,
      },
    ],
    Status.MAINTENANCE,
    new Date('2024-09-15'),
    '/img/maquinas/press_pecho.jpg',
  ),
  new Machine(
    'machine-3',
    'Elíptica CardioMax Pro',
    'Máquina elíptica con resistencia magnética y monitor de frecuencia cardíaca',
    [
      { id: 'spec-cardio-2', name: 'Cardio', description: 'Ejercicio cardiovascular' },
      {
        id: 'spec-bajo-1',
        name: 'Bajo Impacto',
        description: 'Ejercicio de bajo impacto articular',
      },
    ],
    new Date('2024-02-05'),
    [
      {
        id: 'room-1',
        name: 'Sala Cardio',
        description: 'Área de máquinas cardiovasculares',
        location: 'Primer Piso',
        capacity: 30,
      },
      {
        id: 'room-2',
        name: 'Sala Pesas',
        description: 'Área de entrenamiento con pesas y máquinas de fuerza',
        location: 'Segundo Piso',
        capacity: 25,
      },
    ],
    Status.ACTIVE,
    new Date('2024-02-05'),
    '/img/maquinas/Eliptica.jpg',
  ),
  new Machine(
    'machine-4',
    'Prensa de Piernas Heavy Duty',
    'Prensa de piernas para entrenamiento de fuerza en el tren inferior',
    [
      { id: 'spec-fuerza-2', name: 'Fuerza', description: 'Entrenamiento de fuerza' },
      { id: 'spec-piernas-1', name: 'Tren Inferior', description: 'Ejercicios para piernas' },
    ],
    new Date('2024-01-20'),
    [
      {
        id: 'room-1',
        name: 'Sala Cardio',
        description: 'Área de máquinas cardiovasculares',
        location: 'Primer Piso',
        capacity: 30,
      },
      {
        id: 'room-2',
        name: 'Sala Pesas',
        description: 'Área de entrenamiento con pesas y máquinas de fuerza',
        location: 'Segundo Piso',
        capacity: 25,
      },
    ],
    Status.ACTIVE,
    new Date('2024-01-20'),
    '/img/maquinas/prensa.jpg',
  ),
  new Machine(
    'machine-5',
    'Polea Alta/Baja Multifuncional',
    'Sistema de poleas versátil para entrenamientos de espalda, brazos y core',
    [
      { id: 'spec-fuerza-3', name: 'Fuerza', description: 'Entrenamiento de fuerza' },
      { id: 'spec-funcional-1', name: 'Funcional', description: 'Entrenamiento funcional' },
    ],
    new Date('2024-02-15'),
    [
      {
        id: 'room-1',
        name: 'Sala Cardio',
        description: 'Área de máquinas cardiovasculares',
        location: 'Primer Piso',
        capacity: 30,
      },
      {
        id: 'room-2',
        name: 'Sala Pesas',
        description: 'Área de entrenamiento con pesas y máquinas de fuerza',
        location: 'Segundo Piso',
        capacity: 25,
      },
    ],
    Status.ACTIVE,
    new Date('2024-02-15'),
    '/img/maquinas/polea.jpg',
  ),
  new Machine(
    'machine-6',
    'Bicicleta Spinning Indoor',
    'Bicicleta estática de spinning con volante de inercia y resistencia magnética',
    [
      { id: 'spec-cardio-3', name: 'Cardio', description: 'Ejercicio cardiovascular' },
      { id: 'spec-spinning-1', name: 'Spinning', description: 'Ciclismo indoor' },
    ],
    new Date('2024-03-01'),
    [
      {
        id: 'room-1',
        name: 'Sala Cardio',
        description: 'Área de máquinas cardiovasculares',
        location: 'Primer Piso',
        capacity: 30,
      },
      {
        id: 'room-2',
        name: 'Sala Pesas',
        description: 'Área de entrenamiento con pesas y máquinas de fuerza',
        location: 'Segundo Piso',
        capacity: 25,
      },
    ],
    Status.INACTIVE,
    new Date('2024-09-20'),
    '/img/maquinas/spinning.jpg',
  ),
]
