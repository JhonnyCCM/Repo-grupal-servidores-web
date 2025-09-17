<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const isScrolled = ref(false)

onMounted(() => {
  // Agregar listener para el scroll (visual)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="{
      'backdrop-blur-md bg-dark-blue-color/90 shadow-lg': isScrolled,
      'bg-dark-blue-color': !isScrolled,
    }"
  >
    <div class="navbar">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li><router-link to="/classes" class="font-bold">Clases</router-link></li>
            <li><router-link to="/machines" class="font-bold">Máquinas</router-link></li>
            <li><router-link to="/coaches" class="font-bold">Entrenadores</router-link></li>
          </ul>
        </div>
        <router-link to="/" class="btn bg-transparent border-none shadow-none">
          <img class="logo h-20 w-auto" src="/img/logo/logo.png" alt="Logo" />
        </router-link>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><router-link to="/classes" class="font-bold">Clases</router-link></li>
          <li><router-link to="/machines" class="font-bold">Máquinas</router-link></li>
          <li><router-link to="/coaches" class="font-bold">Entrenadores</router-link></li>
        </ul>
      </div>
      <div class="navbar-end flex items-center">
        <!-- Botón de inicio de sesión (prototipo) -->
        <router-link
          to="/login"
          class="btn rounded-full bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold border-none shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Iniciar Sesión
        </router-link>

        <!-- Dropdown de usuario eliminado para prototipo; solo se conserva el botón de Iniciar Sesión -->
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Cambia el color de las letras de los enlaces activos */
li > .router-link-exact-active {
  background: linear-gradient(90deg, #4ade80, #60a5fa, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

/* Hace el fondo transparente al hacer hover en los enlaces */
.menu li > a:hover {
  background-color: transparent !important;
}
</style>
