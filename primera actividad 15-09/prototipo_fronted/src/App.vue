<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <html lang="en">
    <AppHeader />
    <main class="pt-16">
      <!-- Compensar el header fijo -->
      <RouterView />
    </main>
    <AppFooter />
  </html>
</template>
