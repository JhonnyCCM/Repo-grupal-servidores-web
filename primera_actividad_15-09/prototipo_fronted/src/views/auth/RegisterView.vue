<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full">
      <!-- Logo y título -->
      <div class="text-center mb-8">
        <div
          class="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4"
        >
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h2>
        <p class="text-gray-600">Únete a nuestro gimnasio hoy mismo</p>
      </div>

      <!-- Formulario -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit="handleSubmit" class="space-y-6">
          <!-- Nombre completo -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo
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
                placeholder="Ingresa tu nombre completo"
                :class="getInputClasses('fullName')"
              />
            </div>
            <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">{{ errors.fullName }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
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
                placeholder="correo@ejemplo.com"
                :class="getInputClasses('email')"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Teléfono -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
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

          <!-- Contraseña -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <input
                id="password"
                v-model="formData.password"
                @blur="validatePassword"
                type="password"
                placeholder="Mínimo 8 caracteres"
                :class="getInputClasses('password')"
              />
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Confirmar contraseña -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                @blur="validateConfirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                :class="getInputClasses('confirmPassword')"
              />
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Fecha de nacimiento -->
          <div>
            <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">
              Fecha de nacimiento
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <input
                id="birthDate"
                v-model="formData.birthDate"
                @blur="validateBirthDate"
                type="date"
                :class="getInputClasses('birthDate')"
              />
            </div>
            <p v-if="errors.birthDate" class="mt-1 text-sm text-red-600">{{ errors.birthDate }}</p>
          </div>

          <!-- Términos y condiciones -->
          <div>
            <div class="flex items-center">
              <input
                id="terms"
                v-model="formData.terms"
                @change="validateTerms"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="terms" class="ml-2 block text-sm text-gray-700">
                Acepto los
                <a href="#" class="text-blue-600 hover:text-blue-500 font-medium"
                  >términos y condiciones</a
                >
                y la
                <a href="#" class="text-blue-600 hover:text-blue-500 font-medium"
                  >política de privacidad</a
                >
              </label>
            </div>
            <p v-if="errors.terms" class="mt-1 text-sm text-red-600">{{ errors.terms }}</p>
          </div>

          <!-- Botón de registro -->
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
          >
            Crear mi cuenta
          </button>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">O continúa con</span>
            </div>
          </div>

          <!-- Social login buttons -->
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              class="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              Facebook
            </button>
          </div>
        </form>

        <!-- Link a login -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿Ya tienes una cuenta?
            <router-link
              to="/login"
              class="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Inicia sesión aquí
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Reactive form data
const formData = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  birthDate: '',
  terms: false,
})

// Error states
const errors = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  birthDate: '',
  terms: '',
})

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

const validatePassword = () => {
  if (!formData.value.password) {
    errors.value.password = 'La contraseña es requerida'
    return false
  }
  if (formData.value.password.length < 8) {
    errors.value.password = 'La contraseña debe tener al menos 8 caracteres'
    return false
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.value.password)) {
    errors.value.password =
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    return false
  }
  errors.value.password = ''
  return true
}

const validateConfirmPassword = () => {
  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Confirma tu contraseña'
    return false
  }
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden'
    return false
  }
  errors.value.confirmPassword = ''
  return true
}

const validateBirthDate = () => {
  if (!formData.value.birthDate) {
    errors.value.birthDate = 'La fecha de nacimiento es requerida'
    return false
  }

  const today = new Date()
  const birthDate = new Date(formData.value.birthDate)
  const age = today.getFullYear() - birthDate.getFullYear()

  if (age < 16) {
    errors.value.birthDate = 'Debes ser mayor de 16 años para registrarte'
    return false
  }

  errors.value.birthDate = ''
  return true
}

const validateTerms = () => {
  if (!formData.value.terms) {
    errors.value.terms = 'Debes aceptar los términos y condiciones'
    return false
  }
  errors.value.terms = ''
  return true
}

// Form submission
const handleSubmit = (event: Event) => {
  event.preventDefault()

  // Validate all fields
  const isValidName = validateFullName()
  const isValidEmail = validateEmail()
  const isValidPhone = validatePhone()
  const isValidPassword = validatePassword()
  const isValidConfirmPassword = validateConfirmPassword()
  const isValidBirthDate = validateBirthDate()
  const isValidTerms = validateTerms()

  // Check if form is valid
  const isFormValid =
    isValidName &&
    isValidEmail &&
    isValidPhone &&
    isValidPassword &&
    isValidConfirmPassword &&
    isValidBirthDate &&
    isValidTerms

  if (isFormValid) {
    console.log('Formulario válido - datos:', formData.value)
    // Here you would normally send the data to your API
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
</script>

<style scoped>
/* Custom styles for form focus states */
input:focus {
  outline: none;
}

/* Smooth transitions for all interactive elements */
button,
input,
a {
  transition: all 0.2s ease-in-out;
}
</style>
