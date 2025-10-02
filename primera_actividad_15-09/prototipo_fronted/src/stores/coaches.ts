import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Coach {
  id: string
  name: string
  lastName: string
  fullName: string
  email: string
  phone: string
  image: string
  bio: string
  specialties: string[]
  certifications: {
    name: string
    institution: string
    date: string
    expirationDate?: string
  }[]
  experience: number // years
  languages: string[]
  schedule: {
    day: string
    startTime: string
    endTime: string
    isAvailable: boolean
  }[]
  rating: number
  totalReviews: number
  hourlyRate: number
  isActive: boolean
  joinDate: string
  socialMedia: {
    instagram?: string
    facebook?: string
    youtube?: string
    linkedin?: string
  }
  personalTraining: boolean
  groupClasses: string[]
  achievements: string[]
  createdAt: string
}

export interface CoachReview {
  id: string
  coachId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface CoachAppointment {
  id: string
  coachId: string
  userId: string
  userName: string
  date: string
  startTime: string
  endTime: string
  type: 'personal-training' | 'consultation' | 'group-class'
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  price: number
  createdAt: string
}

export const useCoachesStore = defineStore('coaches', () => {
  const coaches = ref<Coach[]>([])
  const reviews = ref<CoachReview[]>([])
  const appointments = ref<CoachAppointment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const activeCoaches = computed(() => coaches.value.filter((coach) => coach.isActive))

  const coachesBySpecialty = computed(() => {
    const specialties: Record<string, Coach[]> = {}
    coaches.value.forEach((coach) => {
      coach.specialties.forEach((specialty) => {
        if (!specialties[specialty]) {
          specialties[specialty] = []
        }
        specialties[specialty].push(coach)
      })
    })
    return specialties
  })

  const totalCoaches = computed(() => coaches.value.length)
  const activeCoachesCount = computed(() => activeCoaches.value.length)

  // Actions
  const init = () => {
    coaches.value = [
      {
        id: 'coach-1',
        name: 'Carlos',
        lastName: 'Mendoza',
        fullName: 'Carlos Mendoza',
        email: 'carlos.mendoza@gym.com',
        phone: '+1-555-0101',
        image: '/img/entrenadores/Carlos.jpg',
        bio: 'Entrenador especializado en CrossFit y entrenamiento funcional con más de 8 años de experiencia. Apasionado por ayudar a las personas a alcanzar su máximo potencial físico.',
        specialties: ['CrossFit', 'Entrenamiento Funcional', 'Fuerza', 'Acondicionamiento'],
        certifications: [
          {
            name: 'CrossFit Level 2 Trainer',
            institution: 'CrossFit Inc.',
            date: '2020-03-15',
            expirationDate: '2025-03-15',
          },
          {
            name: 'Functional Movement Screen',
            institution: 'FMS Institute',
            date: '2019-08-20',
          },
        ],
        experience: 8,
        languages: ['Español', 'Inglés'],
        schedule: [
          { day: 'Lunes', startTime: '06:00', endTime: '14:00', isAvailable: true },
          { day: 'Martes', startTime: '06:00', endTime: '14:00', isAvailable: true },
          { day: 'Miércoles', startTime: '06:00', endTime: '14:00', isAvailable: true },
          { day: 'Jueves', startTime: '06:00', endTime: '14:00', isAvailable: true },
          { day: 'Viernes', startTime: '06:00', endTime: '12:00', isAvailable: true },
          { day: 'Sábado', startTime: '08:00', endTime: '12:00', isAvailable: true },
        ],
        rating: 4.9,
        totalReviews: 47,
        hourlyRate: 65,
        isActive: true,
        joinDate: '2020-01-15',
        socialMedia: {
          instagram: '@carlosmendoza_fit',
          youtube: 'Carlos Mendoza Fitness',
        },
        personalTraining: true,
        groupClasses: ['CrossFit Intensivo', 'Entrenamiento Funcional'],
        achievements: [
          'Certificación CrossFit Level 2',
          'Competidor Regional CrossFit Games 2022',
          '50+ atletas entrenados para competencias',
        ],
        createdAt: '2020-01-15T08:00:00Z',
      },
      {
        id: 'coach-2',
        name: 'Ana',
        lastName: 'García',
        fullName: 'Ana García',
        email: 'ana.garcia@gym.com',
        phone: '+1-555-0102',
        image: '/img/entrenadores/Anna.jpg',
        bio: 'Instructora de yoga y pilates certificada con enfoque en bienestar integral. Especialista en técnicas de relajación y fortalecimiento del core.',
        specialties: ['Yoga', 'Pilates', 'Meditación', 'Flexibilidad'],
        certifications: [
          {
            name: 'Yoga Alliance RYT-500',
            institution: 'Yoga Alliance',
            date: '2018-06-10',
            expirationDate: '2025-06-10',
          },
          {
            name: 'Pilates Mat Certification',
            institution: 'Balanced Body',
            date: '2019-02-28',
          },
        ],
        experience: 6,
        languages: ['Español', 'Inglés', 'Francés'],
        schedule: [
          { day: 'Lunes', startTime: '07:00', endTime: '15:00', isAvailable: true },
          { day: 'Martes', startTime: '07:00', endTime: '15:00', isAvailable: true },
          { day: 'Miércoles', startTime: '07:00', endTime: '15:00', isAvailable: true },
          { day: 'Jueves', startTime: '07:00', endTime: '15:00', isAvailable: true },
          { day: 'Viernes', startTime: '07:00', endTime: '13:00', isAvailable: true },
          { day: 'Domingo', startTime: '09:00', endTime: '13:00', isAvailable: true },
        ],
        rating: 4.8,
        totalReviews: 32,
        hourlyRate: 55,
        isActive: true,
        joinDate: '2019-03-01',
        socialMedia: {
          instagram: '@ana_yoga_flow',
          facebook: 'Ana García Yoga',
        },
        personalTraining: true,
        groupClasses: ['Yoga Matutino', 'Pilates Core'],
        achievements: [
          'Certificación Yoga Alliance RYT-500',
          'Workshop de Yoga Terapéutico',
          '200+ horas de formación en meditación',
        ],
        createdAt: '2019-03-01T10:00:00Z',
      },
      {
        id: 'coach-3',
        name: 'Miguel',
        lastName: 'Torres',
        fullName: 'Miguel Torres',
        email: 'miguel.torres@gym.com',
        phone: '+1-555-0103',
        image: '/img/entrenadores/Juan.jpg',
        bio: 'Ex-boxeador profesional convertido en entrenador. Especialista en deportes de combate y acondicionamiento atlético de alta intensidad.',
        specialties: ['Boxeo', 'Kickboxing', 'Acondicionamiento Atlético', 'Defensa Personal'],
        certifications: [
          {
            name: 'Boxing Coach Certification',
            institution: 'USA Boxing',
            date: '2021-01-20',
            expirationDate: '2026-01-20',
          },
          {
            name: 'HIIT Specialist',
            institution: 'NASM',
            date: '2020-11-15',
          },
        ],
        experience: 5,
        languages: ['Español', 'Inglés'],
        schedule: [
          { day: 'Lunes', startTime: '16:00', endTime: '22:00', isAvailable: true },
          { day: 'Martes', startTime: '16:00', endTime: '22:00', isAvailable: true },
          { day: 'Miércoles', startTime: '16:00', endTime: '22:00', isAvailable: true },
          { day: 'Jueves', startTime: '16:00', endTime: '22:00', isAvailable: true },
          { day: 'Viernes', startTime: '16:00', endTime: '20:00', isAvailable: true },
          { day: 'Sábado', startTime: '10:00', endTime: '14:00', isAvailable: true },
        ],
        rating: 4.7,
        totalReviews: 28,
        hourlyRate: 60,
        isActive: true,
        joinDate: '2021-02-01',
        socialMedia: {
          instagram: '@miguel_boxing_coach',
          youtube: 'Miguel Torres Boxing',
        },
        personalTraining: true,
        groupClasses: ['Box Training'],
        achievements: [
          'Ex-campeón regional de boxeo',
          'Certificación USA Boxing',
          '15+ peleadores entrenados',
        ],
        createdAt: '2021-02-01T12:00:00Z',
      },
      {
        id: 'coach-4',
        name: 'Laura',
        lastName: 'Jiménez',
        fullName: 'Laura Jiménez',
        email: 'laura.jimenez@gym.com',
        phone: '+1-555-0104',
        image: '/img/entrenadores/Maria.jpg',
        bio: 'Instructora de spinning y fitness grupal con energía contagiosa. Especialista en crear rutinas motivadoras y divertidas para todos los niveles.',
        specialties: ['Spinning', 'Fitness Grupal', 'Zumba', 'Aeróbicos'],
        certifications: [
          {
            name: 'Spinning Instructor Certification',
            institution: 'Spinning',
            date: '2020-05-10',
            expirationDate: '2025-05-10',
          },
          {
            name: 'Group Fitness Instructor',
            institution: 'ACE',
            date: '2019-09-18',
          },
        ],
        experience: 4,
        languages: ['Español', 'Inglés'],
        schedule: [
          { day: 'Lunes', startTime: '17:00', endTime: '21:00', isAvailable: true },
          { day: 'Martes', startTime: '17:00', endTime: '21:00', isAvailable: true },
          { day: 'Miércoles', startTime: '17:00', endTime: '21:00', isAvailable: true },
          { day: 'Jueves', startTime: '17:00', endTime: '21:00', isAvailable: true },
          { day: 'Viernes', startTime: '17:00', endTime: '19:00', isAvailable: true },
          { day: 'Sábado', startTime: '09:00', endTime: '13:00', isAvailable: true },
        ],
        rating: 4.6,
        totalReviews: 41,
        hourlyRate: 50,
        isActive: true,
        joinDate: '2020-06-15',
        socialMedia: {
          instagram: '@laura_spinning_energy',
          facebook: 'Laura Jiménez Fitness',
        },
        personalTraining: true,
        groupClasses: ['Spinning Power'],
        achievements: [
          'Certificación ACE Group Fitness',
          'Instructora destacada 2023',
          '100+ clases grupales impartidas',
        ],
        createdAt: '2020-06-15T14:00:00Z',
      },
      {
        id: 'coach-5',
        name: 'Sofia',
        lastName: 'Morales',
        fullName: 'Sofia Morales',
        email: 'sofia.morales@gym.com',
        phone: '+1-555-0105',
        image: '/img/entrenadores/Melissa.jpg',
        bio: 'Fisioterapeuta y entrenadora especializada en rehabilitación y entrenamiento correctivo. Enfoque en prevención de lesiones y recuperación funcional.',
        specialties: [
          'Pilates Terapéutico',
          'Rehabilitación',
          'Entrenamiento Correctivo',
          'Prevención de Lesiones',
        ],
        certifications: [
          {
            name: 'Fisioterapia',
            institution: 'Universidad Nacional',
            date: '2017-12-15',
          },
          {
            name: 'Pilates Rehabilitation',
            institution: 'BASI Pilates',
            date: '2019-04-22',
          },
        ],
        experience: 7,
        languages: ['Español', 'Inglés', 'Italiano'],
        schedule: [
          { day: 'Lunes', startTime: '08:00', endTime: '16:00', isAvailable: true },
          { day: 'Martes', startTime: '08:00', endTime: '16:00', isAvailable: true },
          { day: 'Miércoles', startTime: '08:00', endTime: '16:00', isAvailable: true },
          { day: 'Jueves', startTime: '08:00', endTime: '16:00', isAvailable: true },
          { day: 'Viernes', startTime: '08:00', endTime: '14:00', isAvailable: true },
        ],
        rating: 4.9,
        totalReviews: 36,
        hourlyRate: 70,
        isActive: true,
        joinDate: '2018-09-01',
        socialMedia: {
          instagram: '@sofia_pilates_rehab',
          linkedin: 'Sofia Morales Fisioterapeuta',
        },
        personalTraining: true,
        groupClasses: ['Pilates Core'],
        achievements: [
          'Licenciatura en Fisioterapia',
          'Especialización en Pilates Terapéutico',
          '300+ pacientes rehabilitados',
        ],
        createdAt: '2018-09-01T09:00:00Z',
      },
      {
        id: 'coach-6',
        name: 'María',
        lastName: 'Rodríguez',
        fullName: 'María Rodríguez',
        email: 'maria.rodriguez@gym.com',
        phone: '+1-555-0106',
        image: '/img/entrenadores/Elizabeth.jpg',
        bio: 'Bailarina profesional e instructora de Zumba con más de 10 años de experiencia. Especialista en convertir el ejercicio en una experiencia divertida y energizante.',
        specialties: ['Zumba', 'Baile Fitness', 'Aeróbicos', 'Danza'],
        certifications: [
          {
            name: 'Zumba Instructor License',
            institution: 'Zumba Fitness',
            date: '2015-03-20',
            expirationDate: '2025-03-20',
          },
          {
            name: 'Dance Fitness Specialist',
            institution: 'ACSM',
            date: '2016-07-14',
          },
        ],
        experience: 10,
        languages: ['Español', 'Inglés', 'Portugués'],
        schedule: [
          { day: 'Lunes', startTime: '19:00', endTime: '22:00', isAvailable: true },
          { day: 'Martes', startTime: '19:00', endTime: '22:00', isAvailable: true },
          { day: 'Miércoles', startTime: '19:00', endTime: '22:00', isAvailable: true },
          { day: 'Jueves', startTime: '19:00', endTime: '22:00', isAvailable: true },
          { day: 'Viernes', startTime: '19:00', endTime: '21:00', isAvailable: true },
          { day: 'Sábado', startTime: '11:00', endTime: '15:00', isAvailable: true },
          { day: 'Domingo', startTime: '10:00', endTime: '14:00', isAvailable: true },
        ],
        rating: 4.8,
        totalReviews: 52,
        hourlyRate: 45,
        isActive: true,
        joinDate: '2015-01-10',
        socialMedia: {
          instagram: '@maria_zumba_dance',
          facebook: 'María Rodríguez Dance Fitness',
          youtube: 'María Zumba Official',
        },
        personalTraining: false,
        groupClasses: ['Zumba Fitness'],
        achievements: [
          'Instructora Zumba Certificada desde 2015',
          'Bailarina profesional de salsa',
          '500+ clases de Zumba impartidas',
        ],
        createdAt: '2015-01-10T11:00:00Z',
      },
    ]

    // Initialize some sample reviews
    reviews.value = [
      {
        id: 'review-1',
        coachId: 'coach-1',
        userId: 'user-1',
        userName: 'Usuario Demo',
        rating: 5,
        comment:
          'Excelente entrenador, muy motivador y conoce perfectamente la técnica de CrossFit.',
        createdAt: '2024-02-15T10:00:00Z',
      },
    ]

    // Initialize some sample appointments
    appointments.value = [
      {
        id: 'appointment-1',
        coachId: 'coach-1',
        userId: 'user-1',
        userName: 'Usuario Demo',
        date: '2024-03-20',
        startTime: '10:00',
        endTime: '11:00',
        type: 'personal-training',
        status: 'scheduled',
        notes: 'Sesión de entrenamiento funcional',
        price: 65,
        createdAt: '2024-03-15T14:00:00Z',
      },
    ]
  }

  const addCoach = (newCoach: Omit<Coach, 'id' | 'createdAt' | 'fullName'>) => {
    const id = `coach-${Date.now()}`
    const coach: Coach = {
      ...newCoach,
      id,
      fullName: `${newCoach.name} ${newCoach.lastName}`,
      createdAt: new Date().toISOString(),
    }
    coaches.value.push(coach)
    return coach
  }

  const updateCoach = (id: string, updates: Partial<Coach>) => {
    const index = coaches.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      coaches.value[index] = { ...coaches.value[index], ...updates }
      // Update fullName if name or lastName changed
      if (updates.name || updates.lastName) {
        coaches.value[index].fullName =
          `${coaches.value[index].name} ${coaches.value[index].lastName}`
      }
      return coaches.value[index]
    }
    return null
  }

  const removeCoach = (id: string) => {
    const index = coaches.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      coaches.value.splice(index, 1)
      // Remove associated reviews and appointments
      reviews.value = reviews.value.filter((r) => r.coachId !== id)
      appointments.value = appointments.value.filter((a) => a.coachId !== id)
      return true
    }
    return false
  }

  const getCoachById = (id: string) => {
    return coaches.value.find((c) => c.id === id)
  }

  // Review methods
  const addReview = (
    coachId: string,
    userId: string,
    userName: string,
    rating: number,
    comment: string,
  ) => {
    const coach = getCoachById(coachId)
    if (!coach) {
      return { success: false, message: 'Entrenador no encontrado' }
    }

    const review: CoachReview = {
      id: `review-${Date.now()}`,
      coachId,
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    }

    reviews.value.push(review)

    // Update coach rating
    const coachReviews = getCoachReviews(coachId)
    const totalRating = coachReviews.reduce((sum, r) => sum + r.rating, 0)
    coach.rating = Number((totalRating / coachReviews.length).toFixed(1))
    coach.totalReviews = coachReviews.length

    return { success: true, message: 'Reseña agregada', review }
  }

  const getCoachReviews = (coachId: string) => {
    return reviews.value.filter((r) => r.coachId === coachId)
  }

  // Appointment methods
  const bookAppointment = (
    coachId: string,
    userId: string,
    userName: string,
    date: string,
    startTime: string,
    endTime: string,
    type: CoachAppointment['type'],
    notes?: string,
  ) => {
    const coach = getCoachById(coachId)
    if (!coach) {
      return { success: false, message: 'Entrenador no encontrado' }
    }

    if (!coach.isActive) {
      return { success: false, message: 'Entrenador no disponible' }
    }

    const appointment: CoachAppointment = {
      id: `appointment-${Date.now()}`,
      coachId,
      userId,
      userName,
      date,
      startTime,
      endTime,
      type,
      status: 'scheduled',
      notes,
      price: coach.hourlyRate,
      createdAt: new Date().toISOString(),
    }

    appointments.value.push(appointment)

    return { success: true, message: 'Cita agendada exitosamente', appointment }
  }

  const cancelAppointment = (appointmentId: string) => {
    const appointment = appointments.value.find((a) => a.id === appointmentId)
    if (!appointment) {
      return { success: false, message: 'Cita no encontrada' }
    }

    appointment.status = 'cancelled'
    return { success: true, message: 'Cita cancelada' }
  }

  const getCoachAppointments = (coachId: string) => {
    return appointments.value.filter((a) => a.coachId === coachId)
  }

  const getUserAppointments = (userId: string) => {
    return appointments.value.filter((a) => a.userId === userId)
  }

  return {
    // State
    coaches,
    reviews,
    appointments,
    loading,
    error,

    // Computed
    activeCoaches,
    coachesBySpecialty,
    totalCoaches,
    activeCoachesCount,

    // Actions
    init,
    addCoach,
    updateCoach,
    removeCoach,
    getCoachById,
    addReview,
    getCoachReviews,
    bookAppointment,
    cancelAppointment,
    getCoachAppointments,
    getUserAppointments,
  }
})
