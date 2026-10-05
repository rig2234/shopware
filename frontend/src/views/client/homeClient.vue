<template>
  <div class="min-h-screen bg-[#f8f8f8] font-sans text-[#333333]">
    
    <!-- ========== NAVBAR MEJORADO ========== -->
    <nav class="bg-white sticky top-0 z-50 shadow-md border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex justify-between items-center gap-8">
          <!-- Logo -->
          <div class="text-3xl font-bold text-[#d4a574] flex-shrink-0">
            Shopware
          </div>
          
          <!-- Buscador (Centro) -->
          <div class="hidden md:flex flex-1 max-w-md">
            <div class="w-full relative">
              <input 
                type="text" 
                placeholder="Buscar productos..."
                class="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4a574] transition-all"
              />
              <button class="absolute right-3 top-2.5 text-gray-500 hover:text-[#d4a574]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Iconos del lado derecho -->
          <div class="flex items-center gap-6">
            <!-- Carrito -->
            <button class="relative hover:text-[#d4a574] transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </button>

            <!-- Usuario -->
            <button class="hover:text-[#d4a574] transition-colors hidden sm:block">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>

            <!-- Cerrar Sesión -->
            <button 
              @click="cerrarSesion" 
              class="px-4 py-2 bg-[#d4a574] text-white rounded-lg font-semibold text-sm hover:bg-[#c89456] transition-all duration-300 shadow-sm"
            >
              Salir
            </button>
          </div>
        </div>

        <!-- Menu móvil oculto en pantallas grandes -->
        <ul class="flex md:hidden gap-6 list-none mt-4 text-sm">
          <li><a href="#" class="hover:text-[#d4a574] transition-colors">Inicio</a></li>
          <li><a href="#catalogo" class="hover:text-[#d4a574] transition-colors">Catálogo</a></li>
        </ul>
      </div>
    </nav>

    <!-- ========== HERO SECTION MEJORADO ========== -->
    <section class="relative bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white overflow-hidden py-24 px-6">
      <!-- Decoración de fondo -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 right-0 w-96 h-96 bg-[#d4a574] rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-[#d4a574] rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        <!-- Contenido izquierdo -->
        <div class="flex-1">
          <div class="inline-block bg-[#d4a574] text-black px-4 py-1 rounded-full text-sm font-bold mb-4">
            ✨ Nuevo Estilo
          </div>
          <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Estilo que te <span class="text-[#d4a574]">define</span>
          </h1>
          <p class="text-lg text-gray-300 mb-8 leading-relaxed">
            Descubre la mejor colección de ropa casual y cómoda. Diseño moderno, calidad premium y envío rápido a todo el país.
          </p>
          <div class="flex gap-4 flex-wrap">
            <a href="#catalogo" class="px-8 py-3 bg-[#d4a574] text-black rounded-lg font-bold hover:bg-[#c89456] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
              Explorar Colección
            </a>
            <button class="px-8 py-3 border-2 border-[#d4a574] text-[#d4a574] rounded-lg font-bold hover:bg-[#d4a574] hover:text-black transition-all duration-300">
              Ver Ofertas
            </button>
          </div>
        </div>

        <!-- Imagen representativa -->
        <div class="flex-1 text-center">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-[#d4a574] to-transparent rounded-2xl blur-2xl opacity-20"></div>
            <div class="relative w-full h-96 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
              <div class="text-center">
                <svg class="w-32 h-32 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <p class="text-gray-600 font-semibold">Colección Premium</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== CARACTERÍSTICAS ========== -->
    <section class="bg-white py-12 px-6 border-b border-gray-200">
      <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="w-12 h-12 bg-[#d4a574] rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9-4v4m0 0v4"></path>
            </svg>
          </div>
          <h3 class="font-bold text-lg mb-2">Envío Rápido</h3>
          <p class="text-gray-600 text-sm">Entrega en 2-3 días hábiles</p>
        </div>

        <div class="text-center">
          <div class="w-12 h-12 bg-[#d4a574] rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="font-bold text-lg mb-2">Calidad Garantizada</h3>
          <p class="text-gray-600 text-sm">100% satisfacción garantizada</p>
        </div>

        <div class="text-center">
          <div class="w-12 h-12 bg-[#d4a574] rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 class="font-bold text-lg mb-2">Soporte 24/7</h3>
          <p class="text-gray-600 text-sm">Equipo disponible siempre</p>
        </div>

        <div class="text-center">
          <div class="w-12 h-12 bg-[#d4a574] rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="font-bold text-lg mb-2">Mejores Precios</h3>
          <p class="text-gray-600 text-sm">Descuentos y ofertas exclusivas</p>
        </div>
      </div>
    </section>

    <!-- ========== FILTROS Y CATÁLOGO ========== -->
    <section id="catalogo" class="py-16 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-[#1a1a1a] mb-2">Nuestro Catálogo</h2>
          <p class="text-gray-600">Explora nuestra colección de ropa premium</p>
        </div>

        <!-- Filtros -->
        <div class="mb-10 flex flex-wrap gap-3 justify-center">
          <button class="px-6 py-2 bg-[#d4a574] text-white rounded-full font-semibold hover:bg-[#c89456] transition-all">
            Todos
          </button>
          <button class="px-6 py-2 bg-white border-2 border-gray-300 text-gray-800 rounded-full font-semibold hover:border-[#d4a574] hover:text-[#d4a574] transition-all">
            Hombres
          </button>
          <button class="px-6 py-2 bg-white border-2 border-gray-300 text-gray-800 rounded-full font-semibold hover:border-[#d4a574] hover:text-[#d4a574] transition-all">
            Mujeres
          </button>
          <button class="px-6 py-2 bg-white border-2 border-gray-300 text-gray-800 rounded-full font-semibold hover:border-[#d4a574] hover:text-[#d4a574] transition-all">
            Accesorios
          </button>
          <button class="px-6 py-2 bg-white border-2 border-gray-300 text-gray-800 rounded-full font-semibold hover:border-[#d4a574] hover:text-[#d4a574] transition-all">
            Ofertas
          </button>
        </div>

        <!-- Grid de Productos -->
        <div v-if="productos.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div 
            v-for="producto in productos" 
            :key="producto.idProducto" 
            class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-2 group"
          >
            <!-- Imagen con Badge -->
            <div class="relative h-64 overflow-hidden bg-gray-200">
              <img 
                :src="`http://localhost:3000${producto.imagen}`" 
                :alt="producto.nombre"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <!-- Badge de descuento -->
              <div class="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                -20%
              </div>
              <!-- Icono de favorito -->
              <button class="absolute top-3 left-3 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:bg-[#d4a574] hover:text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </button>
            </div>
            
            <!-- Info del producto -->
            <div class="p-4 flex flex-col flex-grow">
              <h3 class="font-bold text-lg text-[#1a1a1a] truncate mb-2">{{ producto.nombre }}</h3>
              
              <!-- Rating -->
              <div class="flex items-center gap-2 mb-3">
                <div class="flex text-yellow-400">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <span class="text-gray-500 text-xs">(120)</span>
              </div>

              <!-- Precio -->
              <div class="mb-4">
                <p class="text-[#d4a574] font-bold text-2xl">
                  ${{ formatPrice(producto.precio) }}
                </p>
                <p class="text-gray-400 line-through text-sm">
                  ${{ formatPrice(producto.precio * 1.25) }}
                </p>
              </div>
              
              <!-- Botones -->
              <div class="flex gap-2 mt-auto">
                <button class="flex-1 py-2 bg-[#1a1a1a] text-white rounded-lg font-semibold hover:bg-[#d4a574] hover:text-[#1a1a1a] transition-all duration-300 text-sm">
                  Agregar
                </button>
                <button class="px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-[#d4a574] hover:text-[#d4a574] transition-all duration-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sin productos -->
        <div v-else class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
          <p class="text-xl text-gray-600 mb-2">Cargando productos...</p>
          <p class="text-gray-500">Por favor espera un momento</p>
        </div>
      </div>
    </section>

    <!-- ========== NEWSLETTER ========== -->
    <section class="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white py-16 px-6 my-12">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-4">Suscríbete a Nuestro Newsletter</h2>
        <p class="text-gray-300 mb-8">Recibe las mejores ofertas y novedades directamente en tu correo</p>
        
        <div class="flex gap-3 flex-col sm:flex-row">
          <input 
            type="email" 
            placeholder="tu@email.com"
            class="flex-1 px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
          />
          <button class="px-8 py-3 bg-[#d4a574] text-black rounded-lg font-bold hover:bg-[#c89456] transition-all duration-300 whitespace-nowrap">
            Suscribirse
          </button>
        </div>
      </div>
    </section>

    <!-- ========== FOOTER MEJORADO ========== -->
    <footer class="bg-[#1a1a1a] text-white py-16 px-6">
      <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <!-- Información -->
        <div>
          <h3 class="text-xl font-bold text-[#d4a574] mb-4">Shopware</h3>
          <p class="text-gray-400 text-sm">Tu tienda de moda online con los mejores estilos y precios del mercado.</p>
        </div>

        <!-- Tienda -->
        <div>
          <h4 class="font-bold mb-4">Tienda</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li><a href="#" class="hover:text-[#d4a574] transition-colors">Novedades</a></li>
            <li><a href="#" class="hover:text-[#d4a574] transition-colors">Ofertas</a></li>
            <li><a href="#" class="hover:text-[#d4a574] transition-colors">Hombres</a></li>
            <li><a href="#" class="hover:text-[#d4a574] transition-colors">Mujeres</a></li>
          </ul>
        </div>

        <!-- Ayuda -->
        <div>
          <h4 class="font-bold mb-4">Ayuda</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li><a href="#" class="hover:text-[#d4a574] transition-colors">Contacto</a></li>
            <li><a href="#" class="hover:text-[#d4a574] transition-colors">Cambios y Devoluciones</a></li>
            <li><a href="#" class="hover:text-[#d4a574] transition-colors">Envíos</a></li>
            <li><a href="#" class="hover:text-[#d4a574] transition-colors">Preguntas Frecuentes</a></li>
          </ul>
        </div>

        <!-- Redes Sociales -->
        <div>
          <h4 class="font-bold mb-4">Síguenos</h4>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 bg-[#d4a574] rounded-full flex items-center justify-center hover:bg-white hover:text-[#d4a574] transition-all">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" class="w-10 h-10 bg-[#d4a574] rounded-full flex items-center justify-center hover:bg-white hover:text-[#d4a574] transition-all">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7"/>
              </svg>
            </a>
            <a href="#" class="w-10 h-10 bg-[#d4a574] rounded-full flex items-center justify-center hover:bg-white hover:text-[#d4a574] transition-all">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16.5 7.5v9a2 2 0 01-2 2h-7a2 2 0 01-2-2v-9a2 2 0 012-2h7a2 2 0 012 2z" fill="white"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
        <p>&copy; 2026 Shopware. Todos los derechos reservados.</p>
        <div class="mt-4 flex justify-center gap-6 text-xs">
          <a href="#" class="hover:text-[#d4a574] transition-colors">Política de Privacidad</a>
          <a href="#" class="hover:text-[#d4a574] transition-colors">Términos de Servicio</a>
          <a href="#" class="hover:text-[#d4a574] transition-colors">Cookies</a>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const productos = ref([])

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2)
}

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
