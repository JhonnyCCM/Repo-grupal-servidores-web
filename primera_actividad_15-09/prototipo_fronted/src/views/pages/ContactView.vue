<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section
      class="hero-background text-white text-center py-20 min-h-[40vh] flex items-center justify-center"
    >
      <div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
        <p class="text-xl text-white/90 max-w-2xl mx-auto">
          ¿Tienes dudas sobre nuestros planes o servicios? Nuestros asesores están listos para
          ayudarte
        </p>
      </div>
    </section>

    <!-- Contact Form & Info -->
    <section class="py-16 -mt-10 relative z-10">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <!-- Contact Form -->
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="mb-8">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">Envíanos un mensaje</h2>
              <p class="text-gray-600">
                Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas
              </p>
            </div>

            <form @submit="handleSubmit" class="space-y-6">
              <!-- Nombre completo -->
              <div>
                <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    id="fullName"
                    v-model="formData.fullName"
                    @blur="validateFullName"
                    type="text"
                    placeholder="Tu nombre completo"
                    :class="getInputClasses('fullName')"
                  />
                </div>
                <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">
                  {{ errors.fullName }}
                </p>
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico *
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      ></path>
                    </svg>
                  </div>
                  <input
                    id="email"
                    v-model="formData.email"
                    @blur="validateEmail"
                    type="email"
                    placeholder="tu@correo.com"
                    :class="getInputClasses('email')"
                  />
                </div>
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>

              <!-- Teléfono -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    id="phone"
                    v-model="formData.phone"
                    @blur="validatePhone"
                    type="tel"
                    placeholder="+1 (234) 567-8900"
                    :class="getInputClasses('phone')"
                  />
                </div>
                <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
              </div>

              <!-- Motivo de contacto -->
              <div>
                <label for="reason" class="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de contacto *
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <select
                    id="reason"
                    v-model="formData.reason"
                    @blur="validateReason"
                    :class="getInputClasses('reason')"
                  >
                    <option value="">Selecciona un motivo</option>
                    <option value="membership">Información sobre membresías</option>
                    <option value="classes">Consultas sobre clases</option>
                    <option value="training">Entrenamiento personalizado</option>
                    <option value="facilities">Instalaciones y servicios</option>
                    <option value="schedule">Horarios y disponibilidad</option>
                    <option value="support">Soporte técnico</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <p v-if="errors.reason" class="mt-1 text-sm text-red-600">{{ errors.reason }}</p>
              </div>

              <!-- Mensaje -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <div class="relative">
                  <textarea
                    id="message"
                    v-model="formData.message"
                    @blur="validateMessage"
                    rows="5"
                    placeholder="Cuéntanos más detalles sobre tu consulta..."
                    :class="getTextareaClasses('message')"
                  ></textarea>
                </div>
                <p v-if="errors.message" class="mt-1 text-sm text-red-600">{{ errors.message }}</p>
                <p class="mt-1 text-sm text-gray-500">
                  {{ formData.message.length }}/500 caracteres
                </p>
              </div>

              <!-- Preferencia de contacto -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  ¿Cómo prefieres que te contactemos?
                </label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="formData.contactPreference"
                      type="radio"
                      value="email"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span class="ml-2 text-gray-700">Correo electrónico</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="formData.contactPreference"
                      type="radio"
                      value="phone"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span class="ml-2 text-gray-700">Llamada telefónica</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="formData.contactPreference"
                      type="radio"
                      value="whatsapp"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span class="ml-2 text-gray-700">WhatsApp</span>
                  </label>
                </div>
              </div>

              <!-- Botón de envío -->
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!isSubmitting" class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                  Enviar mensaje
                </span>
                <span v-else class="flex items-center justify-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </span>
              </button>
            </form>

            <!-- Success Message -->
            <div v-if="showSuccess" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">¡Mensaje enviado exitosamente!</h3>
                  <p class="mt-1 text-sm text-green-700">
                    Nos pondremos en contacto contigo pronto.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="space-y-8">
            <!-- Contact Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              <!-- Phone -->
              <div class="bg-white rounded-xl p-6 shadow-lg">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      class="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 ml-3">Teléfono</h3>
                </div>
                <p class="text-gray-600 mb-2">Llámanos directamente</p>
                <p class="text-blue-600 font-medium">+1 (555) 123-4567</p>
                <p class="text-gray-500 text-sm mt-1">Lunes a Viernes: 6:00 AM - 10:00 PM</p>
              </div>

              <!-- Email -->
              <div class="bg-white rounded-xl p-6 shadow-lg">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      class="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 ml-3">Email</h3>
                </div>
                <p class="text-gray-600 mb-2">Escríbenos un correo</p>
                <p class="text-green-600 font-medium">info@gym.point.com</p>
                <p class="text-gray-500 text-sm mt-1">Respuesta en 24 horas</p>
              </div>

              <!-- WhatsApp -->
              <div class="bg-white rounded-xl p-6 shadow-lg">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"
                      />
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 ml-3">WhatsApp</h3>
                </div>
                <p class="text-gray-600 mb-2">Chatea con nosotros</p>
                <p class="text-green-600 font-medium">+1 (555) 123-4567</p>
                <p class="text-gray-500 text-sm mt-1">Disponible 24/7</p>
              </div>

              <!-- Location -->
              <div class="bg-white rounded-xl p-6 shadow-lg">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      class="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 ml-3">Ubicación</h3>
                </div>
                <p class="text-gray-600 mb-2">Visítanos en matriz</p>
                <p class="text-red-600 font-medium">Av. Circunvalación Vía a San Mateo</p>
                <p class="text-gray-500 text-sm mt-1">Gym.</p>
              </div>
            </div>

            <!-- FAQ Quick Links -->
            <div class="bg-blue-50 rounded-xl p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Preguntas Frecuentes</h3>
              <div class="space-y-3">
                <div class="flex items-start">
                  <svg
                    class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p class="text-gray-700 text-sm">¿Cuáles son los horarios de atención?</p>
                </div>
                <div class="flex items-start">
                  <svg
                    class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p class="text-gray-700 text-sm">¿Ofrecen clases de prueba gratuitas?</p>
                </div>
                <div class="flex items-start">
                  <svg
                    class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p class="text-gray-700 text-sm">¿Qué equipamiento está disponible?</p>
                </div>
                <div class="flex items-start">
                  <svg
                    class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p class="text-gray-700 text-sm">¿Hay descuentos para estudiantes?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Reactive form data
const formData = ref({
  fullName: '',
  email: '',
  phone: '',
  reason: '',
  message: '',
  contactPreference: 'email',
})

// Error states
const errors = ref({
  fullName: '',
  email: '',
  phone: '',
  reason: '',
  message: '',
})

// UI states
const isSubmitting = ref(false)
const showSuccess = ref(false)

// Validation functions
const validateFullName = () => {
  if (!formData.value.fullName.trim()) {
    errors.value.fullName = 'El nombre completo es requerido'
    return false
  }
  if (formData.value.fullName.trim().length < 2) {
    errors.value.fullName = 'El nombre debe tener al menos 2 caracteres'
    return false
  }
  errors.value.fullName = ''
  return true
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email.trim()) {
    errors.value.email = 'El correo electrónico es requerido'
    return false
  }
  if (!emailRegex.test(formData.value.email)) {
    errors.value.email = 'Ingresa un correo electrónico válido'
    return false
  }
  errors.value.email = ''
  return true
}

const validatePhone = () => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  if (!formData.value.phone.trim()) {
    errors.value.phone = 'El teléfono es requerido'
    return false
  }
  if (!phoneRegex.test(formData.value.phone.replace(/[\s\-\(\)]/g, ''))) {
    errors.value.phone = 'Ingresa un número de teléfono válido'
    return false
  }
  errors.value.phone = ''
  return true
}

const validateReason = () => {
  if (!formData.value.reason) {
    errors.value.reason = 'Selecciona un motivo de contacto'
    return false
  }
  errors.value.reason = ''
  return true
}

const validateMessage = () => {
  if (!formData.value.message.trim()) {
    errors.value.message = 'El mensaje es requerido'
    return false
  }
  if (formData.value.message.trim().length < 10) {
    errors.value.message = 'El mensaje debe tener al menos 10 caracteres'
    return false
  }
  if (formData.value.message.length > 500) {
    errors.value.message = 'El mensaje no puede exceder 500 caracteres'
    return false
  }
  errors.value.message = ''
  return true
}

// Form submission
const handleSubmit = async (event: Event) => {
  event.preventDefault()

  // Validate all fields
  const isValidName = validateFullName()
  const isValidEmail = validateEmail()
  const isValidPhone = validatePhone()
  const isValidReason = validateReason()
  const isValidMessage = validateMessage()

  // Check if form is valid
  const isFormValid = isValidName && isValidEmail && isValidPhone && isValidReason && isValidMessage

  if (isFormValid) {
    isSubmitting.value = true

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log('Formulario de contacto enviado:', formData.value)

      // Show success message
      showSuccess.value = true

      // Reset form
      formData.value = {
        fullName: '',
        email: '',
        phone: '',
        reason: '',
        message: '',
        contactPreference: 'email',
      }

      // Hide success message after 5 seconds
      setTimeout(() => {
        showSuccess.value = false
      }, 5000)
    } catch (error) {
      console.error('Error al enviar el formulario:', error)
    } finally {
      isSubmitting.value = false
    }
  }
}

// Helper function to get input classes
const getInputClasses = (fieldName: keyof typeof errors.value) => {
  const baseClasses =
    'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors'
  const errorClasses = 'border-red-300 focus:ring-red-500'
  const normalClasses = 'border-gray-300 focus:ring-blue-500'

  return errors.value[fieldName]
    ? `${baseClasses} ${errorClasses}`
    : `${baseClasses} ${normalClasses}`
}

// Helper function to get textarea classes
const getTextareaClasses = (fieldName: keyof typeof errors.value) => {
  const baseClasses =
    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors resize-none'
  const errorClasses = 'border-red-300 focus:ring-red-500'
  const normalClasses = 'border-gray-300 focus:ring-blue-500'

  return errors.value[fieldName]
    ? `${baseClasses} ${errorClasses}`
    : `${baseClasses} ${normalClasses}`
}
</script>

<style scoped>
.hero-background {
  background-size: cover;
  background-position: center;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/img/banner/banner3.png');
  background-repeat: no-repeat;
}
</style>
