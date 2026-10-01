<template>
  <div class="min-h-screen bg-[#f5f5f5] font-sans text-[#333333]">
    
    <!-- Navbar (Adaptado de .navbar) -->
    <nav class="bg-[#1a1a1a] text-white sticky top-0 z-50 shadow-md py-4">
      <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div class="text-2xl font-bold text-[#d4a574]">Shopware&copy;</div>
        
        <ul class="hidden md:flex gap-8 list-none">
          <li><a href="#" class="text-white hover:text-[#d4a574] transition-colors duration-300">Inicio</a></li>
          <li><a href="#catalogo" class="text-white hover:text-[#d4a574] transition-colors duration-300">Catálogo</a></li>
        </ul>

        <div class="flex items-center gap-4">
          <button 
            @click="cerrarSesion" 
            class="px-4 py-2 bg-transparent border border-[#d4a574] text-white rounded font-semibold text-sm hover:bg-[#d4a574] hover:text-[#1a1a1a] transition-all duration-300"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section (Adaptado de .hero) -->
    <section class="bg-gradient-to-br from-[#f5f5f5] to-[#e0e0e0] py-16 px-6">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div class="flex-1">
          <h1 class="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4 leading-tight">Estilo que te define</h1>
          <p class="text-lg text-gray-600 mb-8">Descubre la mejor colección de ropa casual y cómoda directamente desde nuestro catálogo.</p>
          <a href="#catalogo" class="inline-block px-10 py-4 bg-[#d4a574] text-[#1a1a1a] rounded font-bold hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(212,165,116,0.3)] transition-all duration-300">
            Explorar Colección
          </a>
        </div>
        <div class="flex-1 text-center hidden md:block">
          <!-- Espacio para imagen representativa -->
          <div class="w-full h-80 bg-gray-300 rounded-xl shadow-lg flex items-center justify-center text-gray-500">
            [Imagen de Presentación]
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Productos (Adaptado de .products-section y .product-card) -->
    <section id="catalogo" class="py-16 px-6 max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold text-center text-[#1a1a1a] mb-12">Nuestro Catálogo</h2>

      <div v-if="productos.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div 
          v-for="producto in productos" 
          :key="producto.idProducto" 
          class="bg-white rounded-lg overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] transition-all duration-300 flex flex-col"
        >
          <!-- Contenedor de Imagen con Zoom en Hover -->
          <div class="relative h-64 overflow-hidden group">
            <img 
              :src="`http://localhost:3000${producto.imagen}`" 
              :alt="producto.nombre"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <!-- Información del Producto -->
          <h3 class="font-bold text-lg text-[#1a1a1a] mt-4 mx-4 truncate">{{ producto.nombre }}</h3>
          <p class="text-[#d4a574] font-bold text-xl mx-4 mb-4">${{ producto.precio }}</p>
          
          <!-- Botón de Acción -->
          <button class="mt-auto mx-4 mb-4 block text-center py-3 bg-[#1a1a1a] text-white rounded font-semibold hover:bg-[#d4a574] hover:text-[#1a1a1a] transition-colors duration-300">
            Agregar al Carrito
          </button>
        </div>
      </div>
      
      <div v-else class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 mt-10">
        <p class="text-xl text-gray-500">Cargando productos...</p>
      </div>
    </section>

    <!-- Footer (Adaptado de .footer) -->
    <footer class="bg-[#1a1a1a] text-white py-12 px-6 mt-12">
      <div class="max-w-7xl mx-auto text-center border-t border-gray-800 pt-8 text-gray-400 text-sm">
        <p>&copy; 2026 Shopware. Todos los derechos reservados.</p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const productos = ref([])

const obtenerProductos = async () => {
  try {
    const token = localStorage.getItem('token')
    
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    })

    if (response.ok) {
      const data = await response.json()
      productos.value = data 
    } else {
      console.error('Error al cargar productos')
    }
  } catch (error) {
    console.error('Error de red:', error)
  }
}

onMounted(() => {
  obtenerProductos()
})

const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  router.push('/login')
}
</script>