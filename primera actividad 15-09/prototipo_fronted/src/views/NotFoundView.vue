<template>
  <div
    class="min-h-screen bg-gradient-to-br from-light-color to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 text-center">
      <!-- Número 404 sin círculo -->
      <div class="relative">
        <div
          class="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-color to-secondary-color"
        >
          404
        </div>
      </div>

      <!-- Título y descripción -->
      <div class="space-y-4">
        <h1 class="text-3xl font-bold text-dark-blue-color">¡Oops! Página no encontrada</h1>
        <p class="text-lg text-gray-600">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <p class="text-sm text-gray">
          Es posible que hayas escrito mal la URL o que la página ya no esté disponible.
        </p>
      </div>

      <!-- Acciones -->
      <div class="space-y-4">
        <!-- Botón principal -->
        <div class="space-y-3">
          <router-link
            to="/"
            class="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-primary-color to-secondary-color hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color transition-all duration-300 transform hover:scale-105 font-medium"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
            Volver al Inicio
          </router-link>
        </div>
      </div>

      <!-- Enlaces útiles -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <p class="text-sm text-gray mb-4">¿Buscas algo específico?</p>
        <div class="flex flex-wrap justify-center gap-4 text-sm">
          <router-link
            to="/classes"
            class="text-primary-color hover:text-secondary-color font-medium"
          >
            Clases
          </router-link>
          <router-link
            to="/machines"
            class="text-primary-color hover:text-secondary-color font-medium"
          >
            Máquinas
          </router-link>
          <router-link
            to="/coaches"
            class="text-primary-color hover:text-secondary-color font-medium"
          >
            Entrenadores
          </router-link>
        </div>
      </div>

      <!-- Información de contacto -->
      <div class="mt-6 pt-4 border-t border-gray-200">
        <p class="text-xs text-gray">
          Si crees que esto es un error,
          <router-link
            to="/contact"
            class="text-primary-color hover:text-secondary-color font-medium"
            >Contáctanos
          </router-link>
        </p>
      </div>
    </div>

    <!-- Decoración de fondo -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div
        class="absolute -top-40 -right-32 w-80 h-80 bg-primary-color/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary-color/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
      ></div>
    </div>
  </div>
</template>

<style scoped>
/* Animación personalizada para el texto 404 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.text-9xl {
  animation: float 3s ease-in-out infinite;
}
</style>
