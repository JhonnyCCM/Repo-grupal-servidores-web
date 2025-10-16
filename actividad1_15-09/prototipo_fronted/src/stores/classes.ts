import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GymClass } from '@/domain/entities/gym-class.entity.js'
import { MOCK_GYM_CLASSES } from '../__mocks__/gym-classes.mock.js'
import { DifficultyLevel } from '../domain/value-objects.js'

export const useClassesStore = defineStore('classes', () => {
  // Estado
  const classes = ref<GymClass[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const activeClasses = computed(() => classes.value.filter((gymClass) => gymClass.isActive))

  const classesByCategory = computed(() => {
    const grouped: Record<string, GymClass[]> = {}
    classes.value.forEach((gymClass) => {
      if (!grouped[gymClass.category.name]) {
        grouped[gymClass.category.name] = []
      }
      grouped[gymClass.category.name].push(gymClass)
    })
    return grouped
  })

  const classesByDifficulty = computed(() => {
    const grouped: Record<DifficultyLevel, GymClass[]> = {
      [DifficultyLevel.BEGINNER]: [],
      [DifficultyLevel.INTERMEDIATE]: [],
      [DifficultyLevel.ADVANCED]: [],
    }
    classes.value.forEach((gymClass) => {
      grouped[gymClass.difficultyLevel].push(gymClass)
    })
    return grouped
  })

  const availableSpots = computed(() => {
    return classes.value.reduce((total, gymClass) => {
      return total + (gymClass.capacity - gymClass.enrolledMembers.length)
    }, 0)
  })

  const totalClasses = computed(() => classes.value.length)
  const totalActiveClasses = computed(() => activeClasses.value.length)

  // Acciones
  const loadMockData = async () => {
    loading.value = true
    error.value = null

    try {
      // Simular delay de carga
      await new Promise((resolve) => setTimeout(resolve, 1000))

      classes.value = [...MOCK_GYM_CLASSES]
    } catch (e: unknown) {
      error.value =
        'Error cargando clases: ' + (e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      loading.value = false
    }
  }

  const getClassById = (id: string) => {
    return classes.value.find((gymClass) => gymClass.id === id) || null
  }

  const getClassesByCoach = (coachId: string) => {
    return classes.value.filter((gymClass) => gymClass.coachId.id === coachId)
  }

  const getClassesByCategory = (category: string) => {
    return classes.value.filter((gymClass) => gymClass.category.name === category)
  }

  const getClassesByDifficulty = (difficulty: DifficultyLevel) => {
    return classes.value.filter((gymClass) => gymClass.difficultyLevel === difficulty)
  }

  return {
    // Estado
    classes,
    loading,
    error,
    // Computed
    activeClasses,
    classesByCategory,
    classesByDifficulty,
    availableSpots,
    totalClasses,
    totalActiveClasses,
    // Acciones
    loadMockData,
    getClassById,
    getClassesByCoach,
    getClassesByCategory,
    getClassesByDifficulty,
  }
})
