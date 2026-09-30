<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Panel Principal</h1>
    
    <button 
      @click="cerrarSesion" 
      class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
    >
      Cerrar Sesión
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const cerrarSesion = () => {
  // Limpiar credenciales
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  
  // Redirigir al login
  router.push('/login')
}
</script>