import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Coach } from '../domain/entities/coach.entity.js'
import { MOCK_COACHES } from '../__mocks__/coaches.mock.js'

export const useCoachesStore = defineStore('coaches', () => {
  // Estado
  const coaches = ref<Coach[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const activeCoaches = computed(() => coaches.value.filter((coach) => coach.isActive))

  const coachesBySpeciality = computed(() => {
    const grouped: Record<string, Coach[]> = {}
    coaches.value.forEach((coach) => {
      coach.specialities.forEach((speciality) => {
        if (!grouped[speciality.name]) {
          grouped[speciality.name] = []
        }
        if (!grouped[speciality.name].includes(coach)) {
          grouped[speciality.name].push(coach)
        }
      })
    })
    return grouped
  })

  const totalCoaches = computed(() => coaches.value.length)
  const totalActiveCoaches = computed(() => activeCoaches.value.length)

  // Acciones
  const loadMockData = async () => {
    loading.value = true
    error.value = null

    try {
      // Simular delay de carga
      await new Promise((resolve) => setTimeout(resolve, 800))

      coaches.value = [...MOCK_COACHES]
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = 'Error cargando entrenadores: ' + e.message
      } else {
        error.value = 'Error cargando entrenadores: error desconocido'
      }
    } finally {
      loading.value = false
    }
  }

  const getCoachById = (id: string) => {
    return coaches.value.find((coach) => coach.id === id) || null
  }

  const getCoachesBySpeciality = (specialityName: string) => {
    return coaches.value.filter((coach) =>
      coach.specialities.some((spec) => spec.name === specialityName),
    )
  }

  return {
    // Estado
    coaches,
    loading,
    error,
    // Computed
    activeCoaches,
    coachesBySpeciality,
    totalCoaches,
    totalActiveCoaches,
    // Acciones
    loadMockData,
    getCoachById,
    getCoachesBySpeciality,
  }
})
