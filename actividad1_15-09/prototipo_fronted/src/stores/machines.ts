import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Machine } from '../domain/entities/machine.entity.js'
import { MOCK_MACHINES } from '../__mocks__/machines.mock.js'
import { Status } from '../domain/value-objects.js'

export const useMachinesStore = defineStore('machines', () => {
  // Estado
  const machines = ref<Machine[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const availableMachines = computed(() =>
    machines.value.filter((machine) => machine.status === Status.ACTIVE),
  )

  const machinesByRoom = computed(() => {
    const grouped: Record<string, Machine[]> = {}
    machines.value.forEach((machine) => {
      machine.room.forEach((room) => {
        if (!grouped[room.name]) {
          grouped[room.name] = []
        }
        grouped[room.name].push(machine)
      })
    })
    return grouped
  })

  const machinesByStatus = computed(() => {
    const grouped: Record<Status, Machine[]> = {
      [Status.ACTIVE]: [],
      [Status.INACTIVE]: [],
      [Status.MAINTENANCE]: [],
    }
    machines.value.forEach((machine) => {
      grouped[machine.status].push(machine)
    })
    return grouped
  })

  const totalMachines = computed(() => machines.value.length)
  const totalAvailableMachines = computed(() => availableMachines.value.length)

  // Acciones
  const loadMockData = async () => {
    loading.value = true
    error.value = null

    try {
      // Simular delay de carga
      await new Promise((resolve) => setTimeout(resolve, 600))

      machines.value = [...MOCK_MACHINES]
    } catch (e: unknown) {
      error.value =
        'Error cargando máquinas: ' + (e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      loading.value = false
    }
  }

  const getMachineById = (id: string) => {
    return machines.value.find((machine) => machine.id === id) || null
  }

  const getMachinesByRoom = (roomName: string) => {
    return machines.value.filter((machine) => machine.room.some((r) => r.name === roomName))
  }

  const getMachinesBySpeciality = (specialityName: string) => {
    return machines.value.filter((machine) =>
      machine.specialities.some((spec) => spec.name === specialityName),
    )
  }

  return {
    // Estado
    machines,
    loading,
    error,
    // Computed
    availableMachines,
    machinesByRoom,
    machinesByStatus,
    totalMachines,
    totalAvailableMachines,
    // Acciones
    loadMockData,
    getMachineById,
    getMachinesByRoom,
    getMachinesBySpeciality,
  }
})
