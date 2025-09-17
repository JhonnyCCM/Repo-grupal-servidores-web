<template>
  <div class="machines-view">
    <!-- Header -->
    <section
      class="hero-background text-white text-center py-20 min-h-[50vh] flex items-center justify-center"
    >
      <div>
        <h1 class="text-4xl font-bold">Nuestras Máquinas</h1>
        <p class="mt-2 text-white">Explora las máquinas disponibles para tu entrenamiento</p>
      </div>
    </section>

    <!-- Filtros -->
    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-wrap gap-4 justify-center mb-8">
        <button
          @click="selectedCategory = ''"
          :class="selectedCategory === '' ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded-full transition-colors"
        >
          Todas
        </button>
        <button
          v-for="category in uniqueCategories"
          :key="category"
          @click="selectedCategory = category"
          :class="
            selectedCategory === category ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-700'
          "
          class="px-4 py-2 rounded-full transition-colors"
        >
          {{ category }}
        </button>
      </div>

      <!-- Grid de Máquinas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="machine in filteredMachines"
          :key="machine.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <!-- Imagen de fondo con overlay -->
          <div
            class="relative h-48 bg-cover bg-center bg-gray-200"
            :style="`background-image: url(${machine.image})`"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            <!-- Badge de categoría -->
            <div class="absolute top-3 right-3">
              <span class="bg-blue-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ machine.category }}
              </span>
            </div>

            <!-- Corazón -->
            <button class="absolute top-3 left-3 text-white hover:text-red-500 transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
          </div>

          <!-- Contenido -->
          <div class="p-4">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ machine.name }}</h3>

            <p class="text-gray-600 text-sm mb-4">{{ machine.description }}</p>

            <!-- Especificaciones -->
            <div v-if="machine.specifications" class="space-y-2 mb-4">
              <div v-if="machine.specifications.weight" class="flex items-center text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.57,14.86L22,13.43L20.57,12L17,15.57L8.43,7L12,3.43L10.57,2L9.14,3.43L7.71,2L5.57,4.14L4.14,2.71L2.71,4.14L4.14,5.57L2,7.71L3.43,9.14L4.86,7.71L13.43,16.29L9.86,19.86L11.29,21.29L12.71,19.86L14.14,21.29L16.29,19.14L17.71,20.57L19.14,19.14L17.71,17.71L19.86,15.57L21.29,14.14L19.86,12.71L20.57,14.86Z"
                  />
                </svg>
                <span>{{ machine.specifications.weight }}</span>
              </div>
              <div v-if="machine.specifications.capacity" class="flex items-center text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v7H5v-4H4zm3-5c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm12.5.5h-2.25V16h-1.5v-2.5H13.5V12h1.25V9.5h1.5V12h2.25v1.5z"
                  />
                </svg>
                <span>Capacidad: {{ machine.specifications.capacity }}</span>
              </div>
            </div>

            <!-- Estado de disponibilidad -->
            <div class="mb-4">
              <span
                :class="getAvailabilityBadgeClass(machine.isAvailable)"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ machine.isAvailable ? 'Disponible' : 'En mantenimiento' }}
              </span>
            </div>

            <!-- Likes counter -->
            <div class="flex items-center justify-end text-gray-500">
              <svg class="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
              <span class="text-sm">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMachinesStore } from '../stores/machines'

const machinesStore = useMachinesStore()
const selectedCategory = ref('')

// Cargar máquinas al montar el componente
onMounted(() => {
  // Inicializar el store si no hay datos
  if (machinesStore.totalMachines === 0) {
    machinesStore.init()
  }
})

// Obtener categorías únicas
const uniqueCategories = computed(() => {
  const categories = machinesStore.machines.map((machine) => machine.category)
  return [...new Set(categories)]
})

// Máquinas filtradas
const filteredMachines = computed(() => {
  if (!selectedCategory.value) {
    return machinesStore.machines
  }
  return machinesStore.machines.filter((machine) => machine.category === selectedCategory.value)
})

// Función para obtener la clase CSS del badge de disponibilidad
const getAvailabilityBadgeClass = (isAvailable: boolean) => {
  return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
