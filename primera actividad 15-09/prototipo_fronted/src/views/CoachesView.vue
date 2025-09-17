<template>
  <div class="coaches-view">
    <!-- Header -->
    <section
      class="hero-background text-white text-center py-20 min-h-[50vh] flex items-center justify-center"
    >
      <div>
        <h1 class="text-4xl font-bold">Nuestros Entrenadores</h1>
        <p class="mt-2 text-white">Conoce a nuestro equipo de entrenadores profesionales</p>
      </div>
    </section>

    <!-- Filtros -->
    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-wrap gap-4 justify-center mb-8">
        <button
          @click="selectedSpecialty = ''"
          :class="
            selectedSpecialty === '' ? 'bg-purple-400 text-white' : 'bg-gray-200 text-gray-700'
          "
          class="px-4 py-2 rounded-full transition-colors"
        >
          Todos
        </button>
        <button
          v-for="specialty in uniqueSpecialties"
          :key="specialty"
          @click="selectedSpecialty = specialty"
          :class="
            selectedSpecialty === specialty
              ? 'bg-purple-400 text-white'
              : 'bg-gray-200 text-gray-700'
          "
          class="px-4 py-2 rounded-full transition-colors"
        >
          {{ specialty }}
        </button>
      </div>

      <!-- Grid de Entrenadores -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="coach in filteredCoaches"
          :key="coach.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <!-- Imagen de fondo con overlay -->
          <div
            class="relative h-80 bg-cover bg-center bg-gray-200"
            :style="`background-image: url(${coach.image})`"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            <!-- Badge de especialidad principal -->
            <div class="absolute top-3 right-3">
              <span class="bg-purple-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ coach.specialties[0] || 'Entrenador' }}
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
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ coach.name }}</h3>

            <p class="text-gray-600 text-sm mb-3">{{ coach.bio }}</p>

            <!-- Rating -->
            <div class="flex items-center mb-3">
              <div class="flex text-yellow-400 mr-2">
                <svg
                  v-for="i in 5"
                  :key="i"
                  class="w-4 h-4"
                  :class="i <= Math.floor(coach.rating) ? 'text-yellow-400' : 'text-gray-300'"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              </div>
              <span class="text-sm text-gray-600">{{ coach.rating.toFixed(1) }}</span>
            </div>

            <!-- Experiencia -->
            <div class="flex items-center text-gray-600 mb-3">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                />
                <path d="m12.5 7-1.5 0 0 6 4.25 2.52.77-1.28-3.52-2.09z" />
              </svg>
              <span>{{ coach.experience }}</span>
            </div>

            <!-- Especialidades -->
            <div class="mb-4">
              <p class="text-sm text-gray-600 font-medium mb-2">Especialidades:</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="specialty in coach.specialties.slice(0, 3)"
                  :key="specialty"
                  class="bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded-full text-xs"
                >
                  {{ specialty }}
                </span>
                <span
                  v-if="coach.specialties.length > 3"
                  class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                >
                  +{{ coach.specialties.length - 3 }}
                </span>
              </div>
            </div>

            <!-- Estado activo -->
            <div class="mb-4">
              <span
                :class="getStatusBadgeClass(coach.isActive)"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ coach.isActive ? 'Activo' : 'Inactivo' }}
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
import { useCoachesStore } from '../stores/coaches'

const coachesStore = useCoachesStore()
const selectedSpecialty = ref('')

// Cargar entrenadores al montar el componente
onMounted(() => {
  // Inicializar el store si no hay datos
  if (coachesStore.totalCoaches === 0) {
    coachesStore.init()
  }
})

// Obtener especialidades principales (solo las más importantes)
const uniqueSpecialties = computed(() => {
  const allSpecialties = coachesStore.activeCoaches.flatMap((coach) => coach.specialties)

  // Definir especialidades principales que queremos mostrar
  const mainSpecialties = [
    'CrossFit',
    'Yoga',
    'Pilates',
    'Boxeo',
    'Spinning',
    'Zumba',
    'Fuerza',
    'Acondicionamiento',
  ]

  // Filtrar solo las especialidades principales que existen
  return mainSpecialties.filter((specialty) => allSpecialties.includes(specialty))
})

// Entrenadores filtrados
const filteredCoaches = computed(() => {
  if (!selectedSpecialty.value) {
    return coachesStore.activeCoaches
  }
  return coachesStore.activeCoaches.filter((coach) =>
    coach.specialties.includes(selectedSpecialty.value),
  )
})

// Función para obtener la clase CSS del badge de estado
const getStatusBadgeClass = (isActive: boolean) => {
  return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
.hero-background {
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(#000000bd, #000000bd), url('/img/banner/banner5.png');
  background-repeat: no-repeat;
}
</style>
