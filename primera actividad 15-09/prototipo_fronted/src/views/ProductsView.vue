<template>
  <div class="products-view">
    <section
      class="hero-background text-white text-center py-20 min-h-[50vh] flex items-center justify-center"
    >
      <div>
        <h1 class="text-4xl font-bold">Nuestra Tienda 🏋️‍♂️</h1>
        <p class="mt-2 text-white">Equípate con los mejores suplementos y accesorios</p>
      </div>
    </section>

    <div class="container mx-auto px-6 py-8">
      <div class="flex flex-wrap gap-4 justify-center mb-8">
        <button
          @click="selectedCategory = ''"
          :class="
            selectedCategory === '' ? 'bg-purple-400 text-white' : 'bg-gray-200 text-gray-700'
          "
          class="px-4 py-2 rounded-full transition-colors"
        >
          Todos
        </button>
        <button
          v-for="category in uniqueCategories"
          :key="category"
          @click="selectedCategory = category"
          :class="
            selectedCategory === category
              ? 'bg-purple-400 text-white'
              : 'bg-gray-200 text-gray-700'
          "
          class="px-4 py-2 rounded-full transition-colors"
        >
          {{ category }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div
            class="relative h-64 bg-cover bg-center bg-gray-200"
            :style="`background-image: url(${product.image})`"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            <div class="absolute top-3 right-3">
              <span class="bg-purple-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ product.category }}
              </span>
            </div>
          </div>

          <div class="p-4 flex-grow flex flex-col">
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ product.name }}</h3>

            <div class="flex items-center mb-3">
              <div class="flex text-yellow-400">
                <svg
                  v-for="i in 5"
                  :key="i"
                  class="w-4 h-4"
                  :class="i <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              </div>
              <span class="text-sm text-gray-600 ml-2">{{ product.rating.toFixed(1) }}</span>
            </div>

            <div class="mb-4">
              <span
                :class="getStockBadgeClass(product.stock)"
                class="px-3 py-1 rounded-full text-xs font-semibold"
              >
                {{ product.stock > 0 ? `${product.stock} en Stock` : 'Agotado' }}
              </span>
            </div>

            <div class="flex-grow"></div>

            <div class="flex items-center justify-between mt-4">
              <span class="text-2xl font-bold text-gray-900">${{ product.price.toFixed(2) }}</span>
              <button
                class="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition-colors flex items-center gap-2"
                :disabled="product.stock === 0"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.02.01.01L6.16 11h11.35l-3.4-6.39A1.94 1.94 0 0 0 12.35 4H7.64c-.58 0-1.11.27-1.44.71L3.2 11l1.79 3.25zM6.16 13l-1.97-3.55L7.64 6h4.72l2.6 4.84-2.27 1.16H6.16z" />
                </svg>
                <span>Añadir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// PASO 1: Importa la interfaz 'Product' junto con el store
import { useProductsStore, type Product } from '@/stores/products'

const productsStore = useProductsStore()
const selectedCategory = ref('')

// Cargar productos al montar el componente
onMounted(() => {
  if (productsStore.totalProducts === 0) {
    productsStore.init()
  }
})

// Obtener categorías únicas de los productos disponibles
const uniqueCategories = computed(() => {
  // PASO 2: Añade el tipo a 'product'
  const allCategories = productsStore.availableProducts.map((product: Product) => product.category)
  return [...new Set(allCategories)] 
})

// Productos filtrados por categoría
const filteredProducts = computed(() => {
  if (!selectedCategory.value) {
    return productsStore.availableProducts
  }
  // PASO 2: Añade el tipo a 'product' aquí también
  return productsStore.availableProducts.filter(
    (product: Product) => product.category === selectedCategory.value
  )
})

const getStockBadgeClass = (stock: number): string => {
  if (stock > 10) {
    return 'bg-green-200 text-green-800'
  }
  if (stock > 0) {
    return 'bg-yellow-200 text-yellow-800'
  }
  return 'bg-red-200 text-red-800'
}
</script>

<style scoped>
.hero-background {
  background-image: url('~/assets/hero-bg.jpg');
  background-size: cover;
  background-position: center;
}

.products-view {
  font-family: 'Inter', sans-serif;
}

.products-view h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.products-view p {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}

.products-view button {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
}

.products-view .bg-purple-400 {
  background-color: #6b46c1;
}

.products-view .bg-purple-400:hover {
  background-color: #553c9a;
}

.products-view .bg-fuchsia-600 {
  background-color: #d53f8c;
}

.products-view .bg-fuchsia-600:hover {
  background-color: #b83280;
}

.products-view .text-yellow-400 {
  color: #d69e2e;
}

.products-view .text-yellow-400:hover {
  color: #b77900;
}

.products-view .text-gray-900 {
  color: #1a202c;
}

.products-view .text-gray-600 {
  color: #4a5568;
}

.products-view .rounded-2xl {
  border-radius: 1rem;
}

.products-view .shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.products-view .hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.products-view .transition-all {
  transition: all 0.3s ease;
}

.products-view .duration-300 {
  transition-duration: 300ms;
}

.products-view .bg-gray-200 {
  background-color: #edf2f7;
}

.products-view .text-gray-700 {
  color: #4a5568;
}

.products-view .rounded-full {
  border-radius: 9999px;
}

.products-view .px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.products-view .py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.products-view .text-sm {
  font-size: 0.875rem;
}

.products-view .font-medium {
  font-weight: 500;
}

.products-view .font-bold {
  font-weight: 700;
}

.products-view .gap-4 {
  gap: 1rem;
}

.products-view .mb-8 {
  margin-bottom: 2rem;
}

.products-view .mt-2 {
  margin-top: 0.5rem;
}

.products-view .flex-grow {
  flex-grow: 1;
}

.products-view .min-h-\[50vh\] {
  min-height: 50vh;
}
</style>