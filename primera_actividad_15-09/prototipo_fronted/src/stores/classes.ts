import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface GymClass {
  id: string
  name: string
  description: string
  instructor: string
  instructorId: string
  category: string
  image: string
  duration: number // in minutes
  maxCapacity: number
  currentEnrollment: number
  schedule: {
    day: string
    startTime: string
    endTime: string
  }[]
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado'
  price: number
  isActive: boolean
  equipment: string[]
  createdAt: string
}

export interface ClassEnrollment {
  id: string
  classId: string
  userId: string
  userName: string
  enrollmentDate: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

export const useClassesStore = defineStore('classes', () => {
  const classes = ref<GymClass[]>([])
  const enrollments = ref<ClassEnrollment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const activeClasses = computed(() => classes.value.filter((gymClass) => gymClass.isActive))

  const classesByCategory = computed(() => {
    const categories: Record<string, GymClass[]> = {}
    classes.value.forEach((gymClass) => {
      if (!categories[gymClass.category]) {
        categories[gymClass.category] = []
      }
      categories[gymClass.category].push(gymClass)
    })
    return categories
  })

  const totalClasses = computed(() => classes.value.length)
  const totalActiveClasses = computed(() => activeClasses.value.length)

  // Actions
  const init = () => {
    // Initialize with default data
    classes.value = [
      {
        id: 'class-1',
        name: 'Yoga Matutino',
        description:
          'Clase de yoga para comenzar el día con energía y tranquilidad. Enfocada en posturas básicas y respiración.',
        instructor: 'Ana García',
        instructorId: 'instructor-1',
        category: 'Bienestar',
        image: '/img/clases/yoga.jpg',
        duration: 60,
        maxCapacity: 20,
        currentEnrollment: 15,
        schedule: [
          { day: 'Lunes', startTime: '07:00', endTime: '08:00' },
          { day: 'Miércoles', startTime: '07:00', endTime: '08:00' },
          { day: 'Viernes', startTime: '07:00', endTime: '08:00' },
        ],
        difficulty: 'Principiante',
        price: 25.0,
        isActive: true,
        equipment: ['Mat de yoga', 'Bloques', 'Correa'],
        createdAt: '2024-01-15T08:00:00Z',
      },
      {
        id: 'class-2',
        name: 'CrossFit Intensivo',
        description:
          'Entrenamiento funcional de alta intensidad que combina ejercicios de fuerza, resistencia y agilidad.',
        instructor: 'Carlos Mendoza',
        instructorId: 'instructor-2',
        category: 'Fuerza',
        image: '/img/clases/crossfit.jpg',
        duration: 45,
        maxCapacity: 15,
        currentEnrollment: 12,
        schedule: [
          { day: 'Martes', startTime: '18:00', endTime: '18:45' },
          { day: 'Jueves', startTime: '18:00', endTime: '18:45' },
          { day: 'Sábado', startTime: '09:00', endTime: '09:45' },
        ],
        difficulty: 'Avanzado',
        price: 35.0,
        isActive: true,
        equipment: ['Barras', 'Discos', 'Kettlebells', 'Cajones'],
        createdAt: '2024-01-20T10:00:00Z',
      },
      {
        id: 'class-3',
        name: 'Box Training',
        description:
          'Entrenamiento de boxeo que combina técnica, condición física y coordinación. Perfecto para liberar estrés.',
        instructor: 'Miguel Torres',
        instructorId: 'instructor-3',
        category: 'Cardio',
        image: '/img/clases/box.jpg',
        duration: 50,
        maxCapacity: 12,
        currentEnrollment: 8,
        schedule: [
          { day: 'Lunes', startTime: '19:00', endTime: '19:50' },
          { day: 'Miércoles', startTime: '19:00', endTime: '19:50' },
          { day: 'Viernes', startTime: '19:00', endTime: '19:50' },
        ],
        difficulty: 'Intermedio',
        price: 30.0,
        isActive: true,
        equipment: ['Guantes de boxeo', 'Vendas', 'Sacos de boxeo'],
        createdAt: '2024-02-01T14:00:00Z',
      },
      {
        id: 'class-4',
        name: 'Spinning Power',
        description:
          'Clase de ciclismo indoor con música energizante. Quema calorías mientras te diviertes.',
        instructor: 'Laura Jiménez',
        instructorId: 'instructor-4',
        category: 'Cardio',
        image: '/img/clases/spinning.jpg',
        duration: 45,
        maxCapacity: 25,
        currentEnrollment: 20,
        schedule: [
          { day: 'Lunes', startTime: '17:00', endTime: '17:45' },
          { day: 'Martes', startTime: '17:00', endTime: '17:45' },
          { day: 'Jueves', startTime: '17:00', endTime: '17:45' },
          { day: 'Sábado', startTime: '10:00', endTime: '10:45' },
        ],
        difficulty: 'Intermedio',
        price: 28.0,
        isActive: true,
        equipment: ['Bicicleta estática', 'Toalla', 'Botella de agua'],
        createdAt: '2024-02-10T16:00:00Z',
      },
      {
        id: 'class-5',
        name: 'Pilates Core',
        description:
          'Fortalece tu core y mejora tu postura con ejercicios controlados y precisos de pilates.',
        instructor: 'Sofia Morales',
        instructorId: 'instructor-5',
        category: 'Bienestar',
        image: '/img/clases/pilates.jpg',
        duration: 55,
        maxCapacity: 18,
        currentEnrollment: 14,
        schedule: [
          { day: 'Martes', startTime: '08:00', endTime: '08:55' },
          { day: 'Jueves', startTime: '08:00', endTime: '08:55' },
          { day: 'Domingo', startTime: '09:00', endTime: '09:55' },
        ],
        difficulty: 'Principiante',
        price: 26.0,
        isActive: true,
        equipment: ['Mat', 'Pelota de pilates', 'Bandas elásticas'],
        createdAt: '2024-02-15T12:00:00Z',
      },
      {
        id: 'class-6',
        name: 'Zumba Fitness',
        description:
          'Baila y quema calorías con ritmos latinos. Una clase divertida que no se siente como ejercicio.',
        instructor: 'María Rodríguez',
        instructorId: 'instructor-6',
        category: 'Baile',
        image: '/img/clases/zumba.jpg',
        duration: 50,
        maxCapacity: 30,
        currentEnrollment: 25,
        schedule: [
          { day: 'Lunes', startTime: '20:00', endTime: '20:50' },
          { day: 'Miércoles', startTime: '20:00', endTime: '20:50' },
          { day: 'Viernes', startTime: '20:00', endTime: '20:50' },
          { day: 'Sábado', startTime: '11:00', endTime: '11:50' },
        ],
        difficulty: 'Principiante',
        price: 24.0,
        isActive: true,
        equipment: ['Ropa cómoda', 'Zapatillas deportivas', 'Toalla'],
        createdAt: '2024-02-20T18:00:00Z',
      },
    ]

    // Initialize some sample enrollments
    enrollments.value = [
      {
        id: 'enrollment-1',
        classId: 'class-1',
        userId: 'user-1',
        userName: 'Usuario Demo',
        enrollmentDate: '2024-03-01T10:00:00Z',
        status: 'confirmed',
      },
    ]
  }

  const addClass = (newClass: Omit<GymClass, 'id' | 'createdAt'>) => {
    const id = `class-${Date.now()}`
    const gymClass: GymClass = {
      ...newClass,
      id,
      createdAt: new Date().toISOString(),
    }
    classes.value.push(gymClass)
    return gymClass
  }

  const updateClass = (id: string, updates: Partial<GymClass>) => {
    const index = classes.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      classes.value[index] = { ...classes.value[index], ...updates }
      return classes.value[index]
    }
    return null
  }

  const removeClass = (id: string) => {
    const index = classes.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      classes.value.splice(index, 1)
      // Remove associated enrollments
      enrollments.value = enrollments.value.filter((e) => e.classId !== id)
      return true
    }
    return false
  }

  const getClassById = (id: string) => {
    return classes.value.find((c) => c.id === id)
  }

  // Enrollment methods
  const enrollInClass = (classId: string, userId: string, userName: string) => {
    const gymClass = getClassById(classId)
    if (!gymClass) {
      return { success: false, message: 'Clase no encontrada' }
    }

    if (gymClass.currentEnrollment >= gymClass.maxCapacity) {
      return { success: false, message: 'La clase está llena' }
    }

    // Check if user is already enrolled
    const existingEnrollment = enrollments.value.find(
      (e) => e.classId === classId && e.userId === userId && e.status === 'confirmed',
    )

    if (existingEnrollment) {
      return { success: false, message: 'Ya estás inscrito en esta clase' }
    }

    const enrollment: ClassEnrollment = {
      id: `enrollment-${Date.now()}`,
      classId,
      userId,
      userName,
      enrollmentDate: new Date().toISOString(),
      status: 'confirmed',
    }

    enrollments.value.push(enrollment)
    gymClass.currentEnrollment++

    return { success: true, message: 'Inscripción exitosa', enrollment }
  }

  const cancelEnrollment = (enrollmentId: string) => {
    const enrollment = enrollments.value.find((e) => e.id === enrollmentId)
    if (!enrollment) {
      return { success: false, message: 'Inscripción no encontrada' }
    }

    const gymClass = getClassById(enrollment.classId)
    if (gymClass) {
      gymClass.currentEnrollment--
    }

    enrollment.status = 'cancelled'
    return { success: true, message: 'Inscripción cancelada' }
  }

  const getUserEnrollments = (userId: string) => {
    return enrollments.value.filter((e) => e.userId === userId)
  }

  const isUserEnrolled = (classId: string, userId: string) => {
    return enrollments.value.some(
      (e) => e.classId === classId && e.userId === userId && e.status === 'confirmed',
    )
  }

  const getClassEnrollments = (classId: string) => {
    return enrollments.value.filter((e) => e.classId === classId && e.status === 'confirmed')
  }

  return {
    // State
    classes,
    enrollments,
    loading,
    error,

    // Computed
    activeClasses,
    classesByCategory,
    totalClasses,
    totalActiveClasses,

    // Actions
    init,
    addClass,
    updateClass,
    removeClass,
    getClassById,
    enrollInClass,
    cancelEnrollment,
    getUserEnrollments,
    isUserEnrolled,
    getClassEnrollments,
  }
})
