<template>
  <div class="classes-view">
    <!-- Header -->
    <section
      class="hero-background text-white text-center py-20 min-h-[50vh] flex items-center justify-center"
    >
      <div>
        <h1 class="text-4xl font-bold">Nuestras Clases</h1>
        <p class="mt-2 text-white">
          Descubre nuestra amplia variedad de clases diseñadas para todos los niveles
        </p>
      </div>
    </section>

    <!-- Filtros -->
    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-wrap gap-4 justify-center mb-8">
        <button
          @click="selectedCategory = ''"
          :class="
            selectedCategory === '' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
          "
          class="px-4 py-2 rounded-full transition-colors"
        >
          Todas
        </button>
        <button
          v-for="category in uniqueCategories"
          :key="category"
          @click="selectedCategory = category"
          :class="
            selectedCategory === category ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-700'
          "
          class="px-4 py-2 rounded-full transition-colors"
        >
          {{ category }}
        </button>
      </div>

      <!-- Grid de Clases -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="classItem in filteredClasses"
          :key="classItem.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <!-- Imagen de fondo con overlay -->
          <div
            class="relative h-48 bg-cover bg-center bg-gray-200"
            :style="`background-image: url(${classItem.image})`"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            <!-- Badge de categoría -->
            <div class="absolute top-3 right-3">
              <span class="bg-green-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ classItem.category }}
              </span>
            </div>

            <!-- Badge de estado -->
            <div class="absolute top-3 left-3">
              <span
                :class="getStatusBadgeClass(classItem.isActive)"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ classItem.isActive ? 'Activa' : 'Inactiva' }}
              </span>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-4">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ classItem.name }}</h3>

            <p class="text-gray-600 text-sm mb-4">{{ classItem.description }}</p>

            <!-- Información de la clase -->
            <div class="space-y-2 mb-4">
              <!-- Instructor -->
              <div class="flex items-center text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{{ classItem.instructor }}</span>
              </div>

              <!-- Horario -->
              <div class="flex items-center text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ formatSchedule(classItem.schedule) }}</span>
              </div>

              <!-- Duración -->
              <div class="flex items-center text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{{ classItem.duration }} min</span>
              </div>

              <!-- Capacidad -->
              <div class="flex items-center text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>{{ classItem.currentEnrollment }}/{{ classItem.maxCapacity }}</span>
              </div>

              <!-- Precio -->
              <div class="flex items-center text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <span>${{ classItem.price }}</span>
              </div>
            </div>

            <!-- Botón de reserva -->
            <button
              :disabled="
                !classItem.isActive || classItem.currentEnrollment >= classItem.maxCapacity
              "
              :class="
                classItem.isActive && classItem.currentEnrollment < classItem.maxCapacity
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              "
              class="w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              {{
                !classItem.isActive
                  ? 'No Disponible'
                  : classItem.currentEnrollment >= classItem.maxCapacity
                    ? 'Clase Llena'
                    : 'Reservar Clase'
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useClassesStore } from '../stores/classes'

const classesStore = useClassesStore()
const selectedCategory = ref('')

// Cargar clases al montar el componente
onMounted(() => {
  // Inicializar el store si no hay datos
  if (classesStore.totalClasses === 0) {
    classesStore.init()
  }
})

// Obtener categorías únicas
const uniqueCategories = computed(() => {
  const categories = classesStore.activeClasses.map((classItem) => classItem.category)
  return [...new Set(categories)]
})

// Clases filtradas
const filteredClasses = computed(() => {
  if (!selectedCategory.value) {
    return classesStore.activeClasses
  }
  return classesStore.activeClasses.filter(
    (classItem) => classItem.category === selectedCategory.value,
  )
})

// Función para obtener la clase CSS del badge de estado
const getStatusBadgeClass = (isActive: boolean) => {
  return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
}

// Función para formatear horarios
const formatSchedule = (schedule: { day: string; startTime: string; endTime: string }[]) => {
  if (!schedule || schedule.length === 0) return 'Sin horario'
  return schedule.map((s) => `${s.day}: ${s.startTime}-${s.endTime}`).join(', ')
}
</script>

<style scoped>
.hero-background {
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(#000000bd, #000000bd), url('/img/banner/banner4.png');
  background-repeat: no-repeat;
}
</style>
