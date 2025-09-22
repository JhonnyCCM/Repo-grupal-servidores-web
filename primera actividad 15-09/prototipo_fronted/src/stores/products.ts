// src/stores/products.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Definimos la estructura de un producto
export interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  rating: number
  image: string
}

export const useProductsStore = defineStore('products', () => {
  // --- STATE ---
  // Usamos ref() para las propiedades reactivas del estado
  const products = ref<Product[]>([])

  // --- GETTERS ---
  // Usamos computed() para los getters
  const availableProducts = computed(() => products.value.filter((p) => p.stock > 0))
  const totalProducts = computed(() => products.value.length)

  // --- ACTIONS ---
  // Las acciones son funciones simples
  function init() {
    // Aquí iría una llamada a una API, pero por ahora simulamos los datos
    products.value = [
      {
        id: 1,
        name: 'Proteína Whey Gold Standard',
        category: 'Suplementos',
        price: 59.99,
        stock: 25,
        rating: 4.8,
        image: '/img/products/proteina.png'
      },
      {
        id: 2,
        name: 'Creatina Monohidratada Micronizada',
        category: 'Suplementos',
        price: 24.5,
        stock: 15,
        rating: 4.9,
        image: '/img/products/creatina.png'
      },
      {
        id: 3,
        name: 'Guantes de Entrenamiento Pro',
        category: 'Accesorios',
        price: 19.99,
        stock: 50,
        rating: 4.5,
        image: '/img/products/guantes.png'
      },
      {
        id: 4,
        name: 'Shaker Pro 700ml',
        category: 'Accesorios',
        price: 9.99,
        stock: 0, // Producto agotado para probar la lógica
        rating: 4.7,
        image: '/img/products/shaker.png'
      },
      {
        id: 5,
        name: 'Cuerda para Saltar de Velocidad',
        category: 'Equipamiento',
        price: 15.0,
        stock: 30,
        rating: 4.6,
        image: '/img/products/cuerda.png'
      },
      {
        id: 6,
        name: 'Pre-Entreno C4 Extreme',
        category: 'Suplementos',
        price: 35.0,
        stock: 8,
        rating: 4.7,
        image: '/img/products/pre-entreno.png'
      }
    ]
  }

  // Exponemos el estado, getters y acciones
  return {
    products,
    availableProducts,
    totalProducts,
    init
  }
})