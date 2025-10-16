<template>
  <div class="coaches-view">
    <!-- Header -->
    <section
      class="hero-background text-white text-center py-20 min-h-[50vh] flex items-center justify-center"
    >
      <div>
        <h1 class="text-4xl font-bold">Nuestros Entrenadores</h1>
        <p class="mt-2 text-white">Conoce al equipo de expertos que te guiará en tu camino.</p>
      </div>
    </section>

    <!-- Contenido Principal -->
    <div class="container mx-auto px-6 py-8">
      <!-- Estado de Carga -->
      <div v-if="coachesStore.loading" class="text-center py-10">
        <p class="text-xl text-gray-600">Cargando entrenadores...</p>
      </div>

      <!-- Estado de Error -->
      <div
        v-else-if="coachesStore.error"
        class="text-center py-10 bg-red-100 text-red-700 p-4 rounded-lg"
      >
        <p class="font-bold">¡Oops! Hubo un problema al cargar los datos.</p>
        <p>{{ coachesStore.error }}</p>
      </div>

      <!-- Grid de Entrenadores -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div
          v-for="coach in coachesStore.coaches"
          :key="coach.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden text-center group"
        >
          <!-- Imagen y Overlay -->
          <div class="relative h-64">
            <img
              :src="coach.imageUrl"
              :alt="`Foto de ${coach.fullName}`"
              class="w-full h-full object-cover object-top"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4"
            >
              <h3 class="text-white text-2xl font-bold">{{ coach.fullName }}</h3>
              <p class="text-green-300 font-medium">
                {{ coach.experienceYears }} años de experiencia
              </p>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-6">
            <p class="text-gray-600 text-sm mb-4 h-16 overflow-hidden">{{ coach.biography }}</p>

            <!-- Especialidades -->
            <div class="mt-4">
              <h4 class="font-semibold text-gray-800 mb-2">Especialidades</h4>
              <div class="flex flex-wrap justify-center gap-2">
                <span
                  v-for="speciality in coach.specialities"
                  :key="speciality.name"
                  class="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ speciality.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCoachesStore } from '../../stores/coaches'

const coachesStore = useCoachesStore()

// Cargar entrenadores al montar el componente
onMounted(() => {
  if (coachesStore.totalCoaches === 0) {
    coachesStore.loadMockData()
  }
})
</script>

<style scoped>
.hero-background {
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(#000000bd, #000000bd), url('/img/banner/banner3.png');
  background-repeat: no-repeat;
}
</style>
