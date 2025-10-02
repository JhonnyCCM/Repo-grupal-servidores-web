import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Machine {
  id: string
  name: string
  description: string
  category: string
  image: string
  brand: string
  model: string
  isAvailable: boolean
  lastMaintenanceDate: string
  nextMaintenanceDate: string
  specifications: {
    weight?: number
    dimensions?: string
    powerRequirement?: string
    capacity?: number
  }
  location: string
  purchaseDate: string
  warranty: {
    provider: string
    expirationDate: string
    contactInfo: string
  }
  usageInstructions: string[]
  safetyGuidelines: string[]
  targetMuscleGroups: string[]
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado'
  rating: number
  totalUsage: number
  createdAt: string
}

export interface MachineUsage {
  id: string
  machineId: string
  userId: string
  userName: string
  startTime: string
  endTime?: string
  duration?: number // in minutes
  notes?: string
  createdAt: string
}

export const useMachinesStore = defineStore('machines', () => {
  const machines = ref<Machine[]>([])
  const usageHistory = ref<MachineUsage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const availableMachines = computed(() => machines.value.filter((machine) => machine.isAvailable))

  const machinesByCategory = computed(() => {
    const categories: Record<string, Machine[]> = {}
    machines.value.forEach((machine) => {
      if (!categories[machine.category]) {
        categories[machine.category] = []
      }
      categories[machine.category].push(machine)
    })
    return categories
  })

  const totalMachines = computed(() => machines.value.length)
  const availableMachinesCount = computed(() => availableMachines.value.length)

  // Actions
  const init = () => {
    machines.value = [
      {
        id: 'machine-1',
        name: 'Caminadora Pro',
        description:
          'Caminadora profesional con múltiples programas de entrenamiento y monitoreo cardíaco.',
        category: 'Cardio',
        image: '/img/maquinas/caminadora.jpg',
        brand: 'TechnoGym',
        model: 'Run Personal',
        isAvailable: true,
        lastMaintenanceDate: '2024-02-15T10:00:00Z',
        nextMaintenanceDate: '2024-05-15T10:00:00Z',
        specifications: {
          weight: 150,
          dimensions: '200 x 90 x 150 cm',
          powerRequirement: '220V',
          capacity: 150,
        },
        location: 'Área de Cardio - Zona A',
        purchaseDate: '2023-06-01T00:00:00Z',
        warranty: {
          provider: 'TechnoGym Service',
          expirationDate: '2025-06-01T00:00:00Z',
          contactInfo: 'soporte@technogym.com',
        },
        usageInstructions: [
          'Ajusta la velocidad gradualmente',
          'Mantén la postura erguida',
          'Usa el cinturón de seguridad',
          'Hidrátate regularmente',
        ],
        safetyGuidelines: [
          'No excedas el límite de peso máximo',
          'Mantén el área libre de obstáculos',
          'Reporta cualquier ruido extraño',
          'No uses dispositivos electrónicos mientras corres',
        ],
        targetMuscleGroups: ['Piernas', 'Glúteos', 'Core'],
        difficulty: 'Principiante',
        rating: 4.8,
        totalUsage: 245,
        createdAt: '2023-06-01T08:00:00Z',
      },
      {
        id: 'machine-2',
        name: 'Elíptica Cross-Training',
        description:
          'Máquina elíptica de bajo impacto que trabaja todo el cuerpo de forma eficiente.',
        category: 'Cardio',
        image: '/img/maquinas/Eliptica.jpg',
        brand: 'Life Fitness',
        model: 'E1 Go',
        isAvailable: true,
        lastMaintenanceDate: '2024-01-20T14:00:00Z',
        nextMaintenanceDate: '2024-04-20T14:00:00Z',
        specifications: {
          weight: 125,
          dimensions: '180 x 75 x 170 cm',
          powerRequirement: '220V',
          capacity: 135,
        },
        location: 'Área de Cardio - Zona B',
        purchaseDate: '2023-07-15T00:00:00Z',
        warranty: {
          provider: 'Life Fitness Support',
          expirationDate: '2025-07-15T00:00:00Z',
          contactInfo: 'servicio@lifefitness.com',
        },
        usageInstructions: [
          'Coloca los pies completamente en los pedales',
          'Mantén el agarre firme en las manijas',
          'Alterna el movimiento de brazos y piernas',
          'Ajusta la resistencia según tu nivel',
        ],
        safetyGuidelines: [
          'Verifica que los pedales estén seguros',
          'No hagas movimientos bruscos',
          'Mantén la espalda recta',
          'Detente si sientes mareos',
        ],
        targetMuscleGroups: ['Piernas', 'Brazos', 'Core', 'Glúteos'],
        difficulty: 'Principiante',
        rating: 4.6,
        totalUsage: 189,
        createdAt: '2023-07-15T10:00:00Z',
      },
      {
        id: 'machine-3',
        name: 'Bicicleta Estática',
        description:
          'Bicicleta estática con programas de spinning y monitoreo avanzado de rendimiento.',
        category: 'Cardio',
        image: '/img/maquinas/spinning.jpg',
        brand: 'Schwinn',
        model: 'IC4',
        isAvailable: false,
        lastMaintenanceDate: '2024-03-01T09:00:00Z',
        nextMaintenanceDate: '2024-06-01T09:00:00Z',
        specifications: {
          weight: 52,
          dimensions: '122 x 51 x 114 cm',
          powerRequirement: 'Sin conexión eléctrica',
          capacity: 136,
        },
        location: 'Sala de Spinning',
        purchaseDate: '2023-08-10T00:00:00Z',
        warranty: {
          provider: 'Schwinn Service',
          expirationDate: '2025-08-10T00:00:00Z',
          contactInfo: 'support@schwinn.com',
        },
        usageInstructions: [
          'Ajusta la altura del asiento',
          'Posiciona el manubrio correctamente',
          'Usa zapatillas con clip si están disponibles',
          'Comienza con resistencia baja',
        ],
        safetyGuidelines: [
          'Asegura bien el asiento y manubrio',
          'No te levantes bruscamente del asiento',
          'Mantén los pies seguros en los pedales',
          'Hidrátate durante el ejercicio',
        ],
        targetMuscleGroups: ['Piernas', 'Glúteos', 'Core'],
        difficulty: 'Intermedio',
        rating: 4.7,
        totalUsage: 156,
        createdAt: '2023-08-10T12:00:00Z',
      },
      {
        id: 'machine-4',
        name: 'Press de Pecho',
        description:
          'Máquina de press de pecho con sistema de peso asistido y múltiples posiciones.',
        category: 'Fuerza',
        image: '/img/maquinas/press_pecho.jpg',
        brand: 'Hammer Strength',
        model: 'Select Chest Press',
        isAvailable: true,
        lastMaintenanceDate: '2024-02-28T11:00:00Z',
        nextMaintenanceDate: '2024-05-28T11:00:00Z',
        specifications: {
          weight: 180,
          dimensions: '140 x 120 x 150 cm',
          powerRequirement: 'Sin conexión eléctrica',
          capacity: 200,
        },
        location: 'Área de Fuerza - Zona Pecho',
        purchaseDate: '2023-05-20T00:00:00Z',
        warranty: {
          provider: 'Hammer Strength Service',
          expirationDate: '2025-05-20T00:00:00Z',
          contactInfo: 'service@hammerstrength.com',
        },
        usageInstructions: [
          'Ajusta el asiento a la altura correcta',
          'Posiciona la espalda completamente en el respaldo',
          'Agarra las manijas con ambas manos',
          'Empuja de forma controlada y regresa lentamente',
        ],
        safetyGuidelines: [
          'No uses peso excesivo',
          'Mantén los pies firmes en el suelo',
          'No hagas movimientos explosivos',
          'Pide asistencia si es necesario',
        ],
        targetMuscleGroups: ['Pectorales', 'Triceps', 'Deltoides anteriores'],
        difficulty: 'Intermedio',
        rating: 4.5,
        totalUsage: 321,
        createdAt: '2023-05-20T14:00:00Z',
      },
      {
        id: 'machine-5',
        name: 'Leg Press 45°',
        description: 'Prensa de piernas a 45 grados para desarrollo de fuerza en el tren inferior.',
        category: 'Fuerza',
        image: '/img/maquinas/prensa.jpg',
        brand: 'Cybex',
        model: 'Eagle NX',
        isAvailable: true,
        lastMaintenanceDate: '2024-03-10T13:00:00Z',
        nextMaintenanceDate: '2024-06-10T13:00:00Z',
        specifications: {
          weight: 250,
          dimensions: '200 x 150 x 140 cm',
          powerRequirement: 'Sin conexión eléctrica',
          capacity: 300,
        },
        location: 'Área de Fuerza - Zona Piernas',
        purchaseDate: '2023-09-05T00:00:00Z',
        warranty: {
          provider: 'Cybex International',
          expirationDate: '2025-09-05T00:00:00Z',
          contactInfo: 'support@cybexintl.com',
        },
        usageInstructions: [
          'Siéntate correctamente en la máquina',
          'Coloca los pies en la plataforma a ancho de hombros',
          'Desciende controladamente hasta 90 grados',
          'Empuja con fuerza pero de forma controlada',
        ],
        safetyGuidelines: [
          'Nunca bloquees completamente las rodillas',
          'Mantén la espalda pegada al respaldo',
          'No uses más peso del que puedes controlar',
          'Asegura los pies en la plataforma',
        ],
        targetMuscleGroups: ['Cuádriceps', 'Glúteos', 'Isquiotibiales'],
        difficulty: 'Avanzado',
        rating: 4.9,
        totalUsage: 278,
        createdAt: '2023-09-05T16:00:00Z',
      },
      {
        id: 'machine-6',
        name: 'Polea Alta',
        description: 'Sistema de poleas múltiples para ejercicios variados de espalda y brazos.',
        category: 'Fuerza',
        image: '/img/maquinas/polea.jpg',
        brand: 'TRX',
        model: 'Functional Trainer',
        isAvailable: true,
        lastMaintenanceDate: '2024-01-15T15:00:00Z',
        nextMaintenanceDate: '2024-04-15T15:00:00Z',
        specifications: {
          weight: 165,
          dimensions: '130 x 100 x 210 cm',
          powerRequirement: 'Sin conexión eléctrica',
          capacity: 180,
        },
        location: 'Área de Fuerza - Zona Funcional',
        purchaseDate: '2023-10-12T00:00:00Z',
        warranty: {
          provider: 'TRX Training',
          expirationDate: '2025-10-12T00:00:00Z',
          contactInfo: 'support@trxtraining.com',
        },
        usageInstructions: [
          'Selecciona el peso adecuado',
          'Ajusta la altura de la polea según el ejercicio',
          'Mantén una postura estable',
          'Controla el movimiento en ambas direcciones',
        ],
        safetyGuidelines: [
          'Revisa que los cables estén en buen estado',
          'No sueltes bruscamente el peso',
          'Mantén el área libre de obstáculos',
          'Usa accesorios apropiados para cada ejercicio',
        ],
        targetMuscleGroups: ['Espalda', 'Bíceps', 'Triceps', 'Hombros'],
        difficulty: 'Intermedio',
        rating: 4.4,
        totalUsage: 203,
        createdAt: '2023-10-12T11:00:00Z',
      },
    ]

    // Initialize some sample usage history
    usageHistory.value = [
      {
        id: 'usage-1',
        machineId: 'machine-1',
        userId: 'user-1',
        userName: 'Usuario Demo',
        startTime: '2024-03-15T08:00:00Z',
        endTime: '2024-03-15T08:30:00Z',
        duration: 30,
        notes: 'Rutina de cardio matutina',
        createdAt: '2024-03-15T08:00:00Z',
      },
    ]
  }

  const addMachine = (newMachine: Omit<Machine, 'id' | 'createdAt'>) => {
    const id = `machine-${Date.now()}`
    const machine: Machine = {
      ...newMachine,
      id,
      createdAt: new Date().toISOString(),
    }
    machines.value.push(machine)
    return machine
  }

  const updateMachine = (id: string, updates: Partial<Machine>) => {
    const index = machines.value.findIndex((m) => m.id === id)
    if (index !== -1) {
      machines.value[index] = { ...machines.value[index], ...updates }
      return machines.value[index]
    }
    return null
  }

  const removeMachine = (id: string) => {
    const index = machines.value.findIndex((m) => m.id === id)
    if (index !== -1) {
      machines.value.splice(index, 1)
      // Remove associated usage history
      usageHistory.value = usageHistory.value.filter((u) => u.machineId !== id)
      return true
    }
    return false
  }

  const getMachineById = (id: string) => {
    return machines.value.find((m) => m.id === id)
  }

  const startMachineUsage = (machineId: string, userId: string, userName: string) => {
    const machine = getMachineById(machineId)
    if (!machine) {
      return { success: false, message: 'Máquina no encontrada' }
    }

    if (!machine.isAvailable) {
      return { success: false, message: 'Máquina no disponible' }
    }

    const usage: MachineUsage = {
      id: `usage-${Date.now()}`,
      machineId,
      userId,
      userName,
      startTime: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    usageHistory.value.push(usage)
    machine.totalUsage++

    return { success: true, message: 'Uso iniciado', usage }
  }

  const endMachineUsage = (usageId: string) => {
    const usage = usageHistory.value.find((u) => u.id === usageId)
    if (!usage) {
      return { success: false, message: 'Registro de uso no encontrado' }
    }

    const endTime = new Date()
    const startTime = new Date(usage.startTime)
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

    usage.endTime = endTime.toISOString()
    usage.duration = duration

    return { success: true, message: 'Uso finalizado', usage }
  }

  const getMachineUsageHistory = (machineId: string) => {
    return usageHistory.value.filter((u) => u.machineId === machineId)
  }

  const getUserUsageHistory = (userId: string) => {
    return usageHistory.value.filter((u) => u.userId === userId)
  }

  return {
    // State
    machines,
    usageHistory,
    loading,
    error,

    // Computed
    availableMachines,
    machinesByCategory,
    totalMachines,
    availableMachinesCount,

    // Actions
    init,
    addMachine,
    updateMachine,
    removeMachine,
    getMachineById,
    startMachineUsage,
    endMachineUsage,
    getMachineUsageHistory,
    getUserUsageHistory,
  }
})
