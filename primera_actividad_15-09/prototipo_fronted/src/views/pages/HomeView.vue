<template>
  <!--hero section-->
  <div class="hero-background relative min-h-[40rem] lg:min-h-0 flex lg:flex-row flex-col">
    <div class="flex lg:flex lg:flex-row flex-col justify-left md:justify-normal h-full flex-1">
      <div class="relative flex-1 z-20 flex items-left justify-left">
        <div class="flex items-center justify-center h-full">
          <div class="w-full max-w-2xl px-6 py-12 lg:p-12 xl:p-16 text-center lg:text-left">
            <h1
              class="text-4xl xl:text-5xl font-bold text-surface-0 lg:text-surface-900 dark:text-surface-0 mb-6 !leading-tight"
            >
              <span class="block text-white">Tu energía, tu espacio, </span>
              <span
                class="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                >tu gimnasio</span
              >
            </h1>

            <p
              class="text-surface-0/90 lg:text-surface-700 dark:text-surface-200 text-xl leading-normal mb-8 max-w-xl lg:max-w-none"
            >
              Mejora tu salud, reduce el estrés y alcanza tus metas físicas en un ambiente pensado
              para ti. Accede a clases guiadas, entrenadores calificados y equipos de última
              generación.
            </p>

            <div class="flex items-center gap-4 justify-center lg:justify-start">
              <router-link
                to="/login"
                class="btn bg-gradient-to-r from-blue-400 to-blue-500 hover:-translate-y-2 transition-transform duration-300 text-white rounded-[1rem]"
              >
                Comienza ahora
              </router-link>
              <router-link
                to="/classes"
                class="btn border border-white text-white bg-transparent transition-transform duration-300 hover:scale-105 rounded-[1rem]"
              >
                Ver clases
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Features Section -->
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          ¿Por qué elegir nuestro
          <span
            class="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
            >gimnasio?</span
          >
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Descubre las ventajas que nos hacen únicos y te ayudan a alcanzar tus objetivos
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div
          class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
        >
          <div
            class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6"
          >
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Equipamiento Moderno</h3>
          <p class="text-gray-600">
            Máquinas de última generación y equipamiento profesional para maximizar tu entrenamiento
          </p>
        </div>

        <!-- Feature 2 -->
        <div
          class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
        >
          <div
            class="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6"
          >
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Entrenadores Certificados</h3>
          <p class="text-gray-600">
            Profesionales altamente calificados que te guiarán hacia tus objetivos de forma segura
          </p>
        </div>

        <!-- Feature 3 -->
        <div
          class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
        >
          <div
            class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6"
          >
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Horarios Flexibles</h3>
          <p class="text-gray-600">
            Abierto las 24 horas para que entrenes cuando mejor te convenga
          </p>
        </div>

        <!-- Feature 4 -->
        <div
          class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
        >
          <div
            class="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-6"
          >
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Clases Grupales</h3>
          <p class="text-gray-600">
            Variedad de clases grupales: yoga, spinning, crossfit, zumba y mucho más
          </p>
        </div>

        <!-- Feature 5 -->
        <div
          class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
        >
          <div
            class="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6"
          >
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Ambiente Saludable</h3>
          <p class="text-gray-600">
            Espacios limpios, ventilados y diseñados para tu bienestar físico y mental
          </p>
        </div>

        <!-- Feature 6 -->
        <div
          class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
        >
          <div
            class="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mb-6"
          >
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Precios Accesibles</h3>
          <p class="text-gray-600">
            Membresías adaptadas a tu presupuesto estudiantil con múltiples opciones de pago
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Plans Section -->
  <section class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          Planes de
          <span
            class="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
            >Membresía</span
          >
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades y objetivos
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Plan Básico -->
        <div
          class="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-400 transition-all duration-300"
        >
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Plan Básico</h3>
            <div class="flex items-center justify-center mb-4">
              <span class="text-4xl font-bold text-gray-900">$29</span>
              <span class="text-gray-600 ml-2">/mes</span>
            </div>
            <p class="text-gray-600">Perfecto para comenzar tu rutina</p>
          </div>

          <ul class="space-y-4 mb-8">
            <li class="flex items-center">
              <svg
                class="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-600">Acceso a zona de pesas</span>
            </li>
            <li class="flex items-center">
              <svg
                class="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-600">Uso de máquinas cardio</span>
            </li>
            <li class="flex items-center">
              <svg
                class="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-600">Vestuarios y duchas</span>
            </li>
            <li class="flex items-center">
              <svg
                class="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-600">Horario: 6AM - 10PM</span>
            </li>
          </ul>

          <button
            class="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Elegir Plan
          </button>
        </div>

        <!-- Plan Premium (Destacado) -->
        <div class="bg-blue-400 text-white rounded-2xl p-8 transform scale-105 shadow-2xl relative">
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span class="bg-orange-400 text-white px-4 py-2 rounded-full text-sm font-medium">
              Más Popular
            </span>
          </div>

          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold mb-2">Plan Premium</h3>
            <div class="flex items-center justify-center mb-4">
              <span class="text-4xl font-bold">$49</span>
              <span class="text-blue-200 ml-2">/mes</span>
            </div>
            <p class="text-blue-200">La opción más completa</p>
          </div>

          <ul class="space-y-4 mb-8">
            <li class="flex items-center">
              <svg
                class="w-5 h-5 text-green-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span>Todo lo del plan básico</span>
            </li>
            <li class="flex items-center">
              <svg
                class="w-5 h-5 text-green-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span>Acceso 24/7</span>
            </li>
            <li class="flex items-center">
              <svg
                class="w-5 h-5 text-green-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span>Clases grupales ilimitadas</span>
            </li>
            <li class="flex items-center">
              <svg
                class="w-5 h-5 text-green-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span>1 sesión personal training</span>
            </li>
            <li class="flex items-center">
              <svg
                class="w-5 h-5 text-green-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span>Plan nutricional básico</span>
            </li>
          </ul>

          <button
            class="w-full bg-white text-blue-400 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Elegir Plan
          </button>
        </div>

        <!-- Plan VIP -->
        <div
          class="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-400 transition-all duration-300"
        >
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Plan VIP</h3>
            <div class="flex items-center justify-center mb-4">
              <span class="text-4xl font-bold text-gray-900">$79</span>
              <span class="text-gray-600 ml-2">/mes</span>
            </div>
            <p class="text-gray-600">Experiencia premium completa</p>
          </div>

          <ul class="space-y-4 mb-8">
            <li class="flex items-center">
              <svg
                class="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-600">Todo lo del plan premium</span>
            </li>
            <li class="flex items-center">
              <svg
                class="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-600">4 sesiones personal training</span>
            </li>
            <li class="flex items-center">
              <svg
                class="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-600">Plan nutricional personalizado</span>
            </li>
            <li class="flex items-center">
              <svg
                class="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-600">Acceso a área VIP</span>
            </li>
            <li class="flex items-center">
              <svg
                class="w-5 h-5 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-600">Masajes y spa</span>
            </li>
          </ul>

          <button
            class="w-full bg-purple-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-500 transition-colors"
          >
            Elegir Plan
          </button>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center mt-16">
        <p class="text-gray-600 mb-6">¿Necesitas ayuda para elegir el plan perfecto?</p>
        <router-link
          to="/contact"
          class="inline-flex items-center px-6 py-3 border border-blue-400 text-blue-400 rounded-lg hover:bg-blue-400 hover:text-white transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.83-.46c-1.378-.487-2.777.024-3.71.952-1.088 1.082-2.797 1.082-3.886 0A3.009 3.009 0 002 18.172V6a2 2 0 012-2h14a2 2 0 012 2v6z"
            ></path>
          </svg>
          Habla con un asesor
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-background {
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(#000000bd, #000000bd), url('/img/banner/gym1.jpeg');
  background-repeat: no-repeat;
}
</style>
