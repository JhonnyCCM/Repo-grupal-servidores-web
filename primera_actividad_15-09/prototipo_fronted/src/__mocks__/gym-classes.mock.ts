import { GymClass } from '../domain/entities/gym-class.entity.js'
import { DifficultyLevel } from '../domain/value-objects.js'
import { MOCK_COACHES } from './coaches.mock.js'

export const MOCK_GYM_CLASSES: GymClass[] = [
  new GymClass(
    'class-1',
    'Yoga Matutino',
    'Clase de yoga suave para comenzar el día con energía y relajación. Ideal para principiantes.',
    MOCK_COACHES[0], // María García
    {
      id: 'spec-7',
      name: 'Dificultad y balance',
      description: 'Ejercicios para mejorar la dificultad y el balance',
    },
    60,
    true,
    new Date('2024-01-20'),
    {
      id: 'spec-core-1',
      name: 'Core',
      description: 'Fortalecimiento del núcleo corporal',
      location: 'Sala 01',
      capacity: 25,
    },
    DifficultyLevel.BEGINNER,
    [
      { day: 'Lunes', startTime: '07:00', endTime: '08:00' },
      { day: 'Miércoles', startTime: '07:00', endTime: '08:00' },
      { day: 'Viernes', startTime: '07:00', endTime: '08:00' },
    ],
    '/img/clases/yoga.jpg',
    new Date('2024-01-20'),
  ),
  new GymClass(
    'class-2',
    'CrossFit Extremo',
    'Entrenamiento de alta intensidad que combina fuerza, resistencia y acondicionamiento físico.',
    MOCK_COACHES[1], // Carlos Ruiz
    { id: 'spec-3', name: 'CrossFit', description: 'Entrenador certificado en CrossFit' },
    75,
    true,
    new Date('2024-02-01'),
    {
      id: 'spec-fuerza-1',
      name: 'Fuerza',
      description: 'Entrenamiento de fuerza',
      location: 'Sala Fuerza',
      capacity: 20,
    },
    DifficultyLevel.ADVANCED,
    [
      { day: 'Martes', startTime: '19:00', endTime: '20:15' },
      { day: 'Jueves', startTime: '19:00', endTime: '20:15' },
    ],
    '/img/clases/crossfit.jpg',
    new Date('2024-02-01'),
  ),
  new GymClass(
    'class-3',
    'Zumba Fitness Party',
    '¡Baila al ritmo de la música latina y quema calorías divirtiéndote! Clase llena de energía.',
    MOCK_COACHES[2], // Ana López
    { id: 'spec-5', name: 'Zumba', description: 'Instructora certificada en Zumba' },
    50,
    true,
    new Date('2024-02-10'),
    {
      id: 'spec-cardio-1',
      name: 'Cardio',
      description: 'Ejercicio cardiovascular',
      location: 'Sala Principal',
      capacity: 30,
    },
    DifficultyLevel.INTERMEDIATE,
    [
      { day: 'Miércoles', startTime: '18:30', endTime: '19:20' },
      { day: 'Viernes', startTime: '18:30', endTime: '19:20' },
    ],
    '/img/clases/zumba.jpg',
    new Date('2024-02-10'),
  ),
  new GymClass(
    'class-4',
    'Pilates Core',
    'Clase enfocada en fortalecer el core y mejorar la postura corporal mediante ejercicios controlados.',
    MOCK_COACHES[0], // María García
    { id: 'spec-2', name: 'Pilates', description: 'Instructor certificado en Pilates' },
    55,
    true,
    new Date('2024-02-15'),
    {
      id: 'spec-core-2',
      name: 'Core',
      description: 'Fortalecimiento del núcleo corporal',
      location: 'Sala Pilates',
      capacity: 20,
    },
    DifficultyLevel.INTERMEDIATE,
    [
      { day: 'Martes', startTime: '17:00', endTime: '17:55' },
      { day: 'Jueves', startTime: '17:00', endTime: '17:55' },
      { day: 'Sábado', startTime: '09:00', endTime: '09:55' },
    ],
    '/img/clases/pilates.jpg',
    new Date('2024-02-15'),
  ),
  new GymClass(
    'class-5',
    'Boxing Fitness',
    'Entrenamiento de boxeo sin contacto que mejora la coordinación, fuerza y resistencia cardiovascular.',
    MOCK_COACHES[3], // Miguel Torres
    { id: 'spec-8', name: 'Boxeo', description: 'Entrenamiento de boxeo sin contacto' },
    60,
    true,
    new Date('2024-03-01'),
    {
      id: 'spec-box-1',
      name: 'Boxeo',
      description: 'Entrenamiento de boxeo',
      location: 'Sala Combate',
      capacity: 25,
    },
    DifficultyLevel.ADVANCED,
    [
      { day: 'Lunes', startTime: '20:00', endTime: '21:00' },
      { day: 'Miércoles', startTime: '20:00', endTime: '21:00' },
    ],
    '/img/clases/box.jpg',
    new Date('2024-03-01'),
  ),
  new GymClass(
    'class-6',
    'Spinning Cardio',
    'Clase de ciclismo indoor con música motivacional y diferentes intensidades de entrenamiento.',
    MOCK_COACHES[4], // Laura Fernández
    { id: 'spec-1', name: 'Spinning', description: 'Instructor certificado en Spinning' },
    45,
    true,
    new Date('2024-03-05'),
    {
      id: 'spec-spinning-1',
      name: 'Spinning',
      description: 'Ciclismo indoor',
      location: 'Sala Spinning',
      capacity: 30,
    },
    DifficultyLevel.INTERMEDIATE,
    [
      { day: 'Lunes', startTime: '18:00', endTime: '18:45' },
      { day: 'Miércoles', startTime: '18:00', endTime: '18:45' },
      { day: 'Viernes', startTime: '18:00', endTime: '18:45' },
    ],
    '/img/clases/spinning.jpg',
    new Date('2024-03-05'),
  ),
]
