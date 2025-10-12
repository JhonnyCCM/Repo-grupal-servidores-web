<template>
  <main class="about max-w-4xl mx-auto py-12 px-6">
    <h1
      class="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent"
    >
      Sobre Nosotros
    </h1>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-2 text-gray-900">Historia del emprendimiento</h2>
      <p class="text-gray-700 leading-relaxed">
        Gym App nació de la experiencia directa con gimnasios locales que aún gestionaban sus
        operaciones de forma manual. La falta de herramientas accesibles provocaba sobrecarga
        administrativa, errores en la gestión de clases y baja satisfacción de los usuarios.
        Decidimos crear una solución clara, ligera y moderna que facilite la administración de
        clases, entrenadores, máquinas y usuarios, permitiendo a los gestores centrarse en mejorar
        la experiencia deportiva.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-2 text-gray-900">Nuestro equipo</h2>
      <p class="text-gray-700 mb-4">
        Equipo multidisciplinario que combina desarrollo, diseño y gestión:
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="member in members"
          :key="member.id"
          class="bg-white shadow-sm rounded-lg overflow-hidden flex flex-col items-center text-center p-6"
        >
          <img
            :src="member.image"
            :alt="member.name"
            class="w-28 h-28 rounded-full object-cover mb-4"
          />
          <h3
            class="font-semibold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            {{ member.name }}
          </h3>
          <p class="text-sm text-gray-600">{{ member.role }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ member.bio }}</p>
        </article>
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-semibold mb-2 text-gray-900">Nuestra misión</h2>
      <p class="text-gray-700 leading-relaxed">
        Brindar herramientas accesibles y eficientes para la gestión de gimnasios, impulsando la
        digitalización de pequeños emprendimientos y mejorando la experiencia de entrenadores y
        usuarios por igual.
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { team } from '../../data/team'

const members = team
</script>
