<template>
  <div class="machines-view">
    <!-- Header -->
    <section
      class="hero-background text-white text-center py-20 min-h-[50vh] flex items-center justify-center"
    >
      <div>
        <h1 class="text-4xl font-bold">Nuestro Equipamiento</h1>
        <p class="mt-2 text-white">Máquinas de última generación para alcanzar tus objetivos</p>
      </div>
    </section>

    <!-- Contenido Principal -->
    <div class="container mx-auto px-6 py-8">
      <!-- Estado de Carga -->
      <div v-if="machinesStore.loading" class="text-center py-10">
        <p class="text-xl text-gray-600">Cargando equipamiento...</p>
      </div>

      <!-- Estado de Error -->
      <div
        v-else-if="machinesStore.error"
        class="text-center py-10 bg-red-100 text-red-700 p-4 rounded-lg"
      >
        <p class="font-bold">¡Oops! Hubo un problema al cargar las máquinas.</p>
        <p>{{ machinesStore.error }}</p>
      </div>

      <!-- Contenido con datos -->
      <div v-else>
        <!-- Filtros (por sala) -->
        <div class="flex flex-wrap gap-4 justify-center mb-8">
          <button
            @click="selectedRoom = ''"
            :class="selectedRoom === '' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'"
            class="px-4 py-2 rounded-full transition-colors"
          >
            Todas las Salas
          </button>
          <button
            v-for="room in uniqueRooms"
            :key="room.id"
            @click="selectedRoom = room.name"
            :class="
              selectedRoom === room.name ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-700'
            "
            class="px-4 py-2 rounded-full transition-colors"
          >
            {{ room.name }}
          </button>
        </div>

        <!-- Grid de Máquinas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="machine in filteredMachines"
            :key="machine.id"
            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <!-- Imagen -->
            <div
              class="relative h-48 bg-cover bg-center bg-gray-200"
              :style="`background-image: url(${machine.imageUrl})`"
            >
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <!-- Badge de estado -->
              <div class="absolute top-3 left-3">
                <span
                  :class="getStatusBadgeClass(machine.status)"
                  class="px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ machine.status }}
                </span>
              </div>
            </div>

            <!-- Contenido -->
            <div class="p-4">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ machine.name }}</h3>
              <p class="text-gray-600 text-sm mb-4 h-16 overflow-hidden">
                {{ machine.description }}
              </p>

              <!-- Información de la máquina -->
              <div class="space-y-2">
                <!-- Sala -->
                <div class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
                  </svg>
                  <span>Sala: {{ machine.room.map((r) => r.name).join(', ') }}</span>
                </div>
                <!-- Especialidades -->
                <div class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"
                    />
                  </svg>
                  <span>Uso: {{ machine.specialities.map((s) => s.name).join(', ') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMachinesStore } from '@/stores/machines'
import { Status } from '@/domain/value-objects'

const machinesStore = useMachinesStore()
const selectedRoom = ref('')

// Cargar máquinas al montar el componente
onMounted(() => {
  if (machinesStore.totalMachines === 0) {
    machinesStore.loadMockData()
  }
})

// Obtener salas únicas

// Obtener salas únicas
const uniqueRooms = computed(() => {
  const roomsMap = new Map<string, { id: string; name: string }>()
  machinesStore.machines.forEach((machine) => {
    machine.room.forEach((room: { id: string; name: string }) => {
      if (!roomsMap.has(room.id)) {
        roomsMap.set(room.id, room)
      }
    })
  })
  return Array.from(roomsMap.values())
})

// Máquinas filtradas
const filteredMachines = computed(() => {
  if (!selectedRoom.value) {
    return machinesStore.machines
  }
  return machinesStore.machines.filter((machine) =>
    machine.room.some((room: { name: string }) => room.name === selectedRoom.value),
  )
})

// Clase CSS para el badge de estado
const getStatusBadgeClass = (status: Status) => {
  switch (status) {
    case Status.ACTIVE:
      return 'bg-green-100 text-green-800'
    case Status.INACTIVE:
      return 'bg-gray-100 text-gray-800'
    case Status.MAINTENANCE:
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<style scoped>
.hero-background {
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(#000000bd, #000000bd), url('/img/banner/banner2.png');
  background-repeat: no-repeat;
}
</style>
