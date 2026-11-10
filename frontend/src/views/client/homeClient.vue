<template>
  <div class="min-h-screen bg-[#f8f8f8] font-sans text-[#333333]">
    <nav class="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-md">
      <div class="mx-auto max-w-7xl px-6 py-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex-shrink-0 text-3xl font-bold text-[#d4a574]">
            Shopware
          </div>

          <div class="order-3 w-full md:order-2 md:flex md:max-w-md md:flex-1">
            <div class="relative w-full">
              <input
                v-model.trim="busqueda"
                type="search"
                placeholder="Buscar productos o categorías..."
                aria-label="Buscar productos o categorías"
                class="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 pr-10 transition-all focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
              />
              <span class="pointer-events-none absolute right-3 top-2.5 text-gray-500" aria-hidden="true">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div class="order-2 ml-auto flex items-center gap-4 md:order-3 md:gap-6">
            <button
              type="button"
              class="relative transition-colors hover:text-[#d4a574]"
              aria-label="Ir al carrito"
              @click="irACarrito"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5m1.6 8l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                0
              </span>
            </button>

            <button
              type="button"
              class="hidden transition-colors hover:text-[#d4a574] sm:block"
              aria-label="Mi cuenta"
              @click="irAlLoginSiNoEstaAutenticado"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            <button
              v-if="estaAutenticado"
              type="button"
              class="rounded-lg bg-[#d4a574] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#c89456]"
              @click="cerrarSesion"
            >
              Salir
            </button>

            <button
              v-else
              type="button"
              class="rounded-lg bg-[#d4a574] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#c89456]"
              @click="irALogin"
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-800 transition-colors hover:border-[#d4a574] hover:text-[#a8733e]"
              aria-label="Abrir categorías"
              :aria-expanded="sidebarAbierta"
              aria-controls="sidebar-categorias"
              @click="sidebarAbierta = !sidebarAbierta"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <ul class="mt-4 flex list-none gap-6 text-sm md:hidden">
          <li><a href="#" class="transition-colors hover:text-[#d4a574]">Inicio</a></li>
          <li><a href="#catalogo" class="transition-colors hover:text-[#d4a574]">Catálogo</a></li>
        </ul>
      </div>
    </nav>

    <section class="relative overflow-hidden bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] px-6 py-24 text-white">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#d4a574] blur-3xl"></div>
        <div class="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#d4a574] blur-3xl"></div>
      </div>

      <div class="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 md:flex-row">
        <div class="flex-1">
          <div class="mb-4 inline-block rounded-full bg-[#d4a574] px-4 py-1 text-sm font-bold text-black">
            ✨ Nuevo Estilo
          </div>
          <h1 class="mb-6 text-5xl font-bold leading-tight md:text-6xl">
            Estilo que te <span class="text-[#d4a574]">define</span>
          </h1>
          <p class="mb-8 text-lg leading-relaxed text-gray-300">
            Descubre la mejor colección de ropa casual y cómoda. Diseño moderno, calidad premium y envío rápido a todo el país.
          </p>
          <div class="flex flex-wrap gap-4">
            <a
              href="#catalogo"
              class="rounded-lg bg-[#d4a574] px-8 py-3 font-bold text-black shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#c89456] hover:shadow-xl"
            >
              Explorar Colección
            </a>
            <button
              type="button"
              class="rounded-lg border-2 border-[#d4a574] px-8 py-3 font-bold text-[#d4a574] transition-all duration-300 hover:bg-[#d4a574] hover:text-black"
              @click="mostrarOfertas"
            >
              Ver Ofertas
            </button>
          </div>
        </div>

        <div class="flex-1 text-center">
          <div class="relative">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#d4a574] to-transparent opacity-20 blur-2xl"></div>
            <div class="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 shadow-2xl">
              <div class="text-center">
                <svg class="mx-auto mb-4 h-32 w-32 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p class="font-semibold text-gray-600">Colección Premium</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-gray-200 bg-white px-6 py-12">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div
          v-for="beneficio in beneficios"
          :key="beneficio.titulo"
          class="text-center"
        >
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a574]">
            <span class="text-xl text-white">{{ beneficio.icono }}</span>
          </div>
          <h3 class="mb-2 text-lg font-bold">{{ beneficio.titulo }}</h3>
          <p class="text-sm text-gray-600">{{ beneficio.descripcion }}</p>
        </div>
      </div>
    </section>

    <section id="catalogo" class="px-6 py-16">
      <div class="mx-auto max-w-7xl">
        <div class="mb-10 text-center">
          <h2 class="mb-2 text-4xl font-bold text-[#1a1a1a]">Nuestro Catálogo</h2>
          <p class="text-gray-600">Explora nuestra colección de ropa premium</p>
        </div>

        <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 class="text-xl font-semibold text-[#1a1a1a]">{{ tituloCategoria }}</h3>

          <p class="text-sm text-gray-500" aria-live="polite">
            {{ productosFiltrados.length }}
            {{ productosFiltrados.length === 1 ? 'producto' : 'productos' }}
          </p>
        </div>

        <aside
          id="sidebar-categorias"
          class="fixed bottom-0 right-0 top-0 z-[60] w-[min(21rem,88vw)] overflow-y-auto border-l border-gray-200 bg-white p-5 pt-6 shadow-2xl transition-transform duration-300 ease-in-out"
          :class="sidebarAbierta ? 'translate-x-0' : 'translate-x-full'"
          :aria-hidden="!sidebarAbierta"
        >
          <div class="mb-5 flex items-center justify-between border-b border-gray-200 pb-4">
            <h3 class="text-lg font-bold text-[#1a1a1a]">Explorar catálogo</h3>

            <button
              type="button"
              class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="Cerrar categorías"
              @click="sidebarAbierta = false"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            @click="mostrarTodosLosProductos"
            :class="categoriaSeleccionada === 'todas'
              ? 'bg-[#d4a574] text-white'
              : 'text-gray-700 hover:bg-gray-100'"
            class="mb-2 w-full rounded-lg px-4 py-3 text-left font-semibold transition-colors"
          >
            Todos los productos
          </button>

          <p v-if="cargandoCategorias" class="px-4 py-2 text-sm text-gray-500">
            Cargando categorías...
          </p>

          <p v-else-if="errorCategorias" class="px-4 py-2 text-sm text-red-600">
            No se pudieron cargar las categorías.
          </p>

          <div v-else class="space-y-2">
            <div v-for="genero in categoriasRaiz" :key="genero.idCategoria">
              <button
                type="button"
                @click="seleccionarGenero(genero)"
                :aria-expanded="String(generoSeleccionado) === String(genero.idCategoria)"
                :class="String(generoSeleccionado) === String(genero.idCategoria)
                  ? 'bg-[#f8f1e9] text-[#a8733e]'
                  : 'text-gray-800 hover:bg-gray-100'"
                class="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left font-bold transition-colors"
              >
                <span>{{ genero.nombre }}</span>
                <span aria-hidden="true">
                  {{ String(generoSeleccionado) === String(genero.idCategoria) ? '−' : '+' }}
                </span>
              </button>

              <div
                v-if="String(generoSeleccionado) === String(genero.idCategoria)"
                class="ml-3 mt-2 space-y-1 border-l-2 border-[#ead8c3] pl-3"
              >
                <button
                  type="button"
                  @click="seleccionarGenero(genero)"
                  :class="categoriaSeleccionada === `genero:${genero.idCategoria}`
                    ? 'bg-[#f8f1e9] font-semibold text-[#a8733e]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#a8733e]'"
                  class="w-full rounded-md px-3 py-2 text-left text-sm transition-colors"
                >
                  Todas las categorías de {{ genero.nombre }}
                </button>

                <button
                  v-for="categoria in subcategoriasDe(genero.idCategoria)"
                  :key="categoria.idCategoria"
                  type="button"
                  @click="seleccionarCategoria(categoria)"
                  :class="String(categoriaSeleccionada) === String(categoria.idCategoria)
                    ? 'bg-[#f8f1e9] font-semibold text-[#a8733e]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#a8733e]'"
                  class="w-full rounded-md px-3 py-2 text-left text-sm transition-colors"
                >
                  {{ categoria.nombre }}
                </button>
              </div>
            </div>
          </div>

          <div class="mt-6 border-t border-gray-200 pt-4">
            <h4 class="mb-2 text-sm font-bold text-gray-500">Más opciones</h4>
            <p class="text-sm text-gray-400">Próximamente</p>
          </div>
        </aside>

        <div
          v-if="productosFiltrados.length"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <article
            v-for="producto in productosFiltrados"
            :key="producto.idProducto"
            class="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div class="relative h-64 overflow-hidden bg-gray-200">
              <img
                :src="urlImagen(producto.imagen)"
                :alt="producto.nombre || 'Producto Shopware'"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <span
                v-if="Number(producto.descuento) > 0"
                class="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white"
              >
                -{{ producto.descuento }}%
              </span>
            </div>

            <div class="flex flex-grow flex-col p-4">
              <p class="mb-1 text-xs text-gray-500">
                {{ nombreCategoriaProducto(producto) }}
              </p>
              <h4 class="mb-3 truncate text-lg font-bold text-[#1a1a1a]">
                {{ producto.nombre }}
              </h4>

              <div class="mb-4">
                <p class="text-2xl font-bold text-[#d4a574]">
                  ${{ formatPrice(precioFinal(producto)) }}
                </p>
                <p
                  v-if="Number(producto.descuento) > 0"
                  class="text-sm text-gray-400 line-through"
                >
                  ${{ formatPrice(producto.precio) }}
                </p>
              </div>

              <div class="mt-auto flex gap-2">
                <button
                  type="button"
                  @click="intentarAgregar(producto)"
                  class="flex-1 rounded-lg bg-[#1a1a1a] py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#d4a574] hover:text-[#1a1a1a]"
                >
                  Agregar
                </button>

                <button
                  type="button"
                  @click="intentarComprar(producto)"
                  class="rounded-lg border-2 border-gray-300 px-3 py-2 transition-all duration-300 hover:border-[#d4a574] hover:text-[#d4a574]"
                  title="Comprar ahora"
                  aria-label="Comprar ahora"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>

        <div
          v-else
          class="rounded-xl border border-gray-200 bg-white py-16 text-center shadow-sm"
        >
          <p class="mb-2 text-xl text-gray-600">
            {{ cargandoProductos ? 'Cargando productos...' : 'No se encontraron productos.' }}
          </p>
          <p class="text-gray-500">
            {{ cargandoProductos ? 'Por favor espera un momento.' : 'Prueba con otra búsqueda o categoría.' }}
          </p>
        </div>
      </div>
    </section>

    <section class="my-12 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] px-6 py-16 text-white">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="mb-4 text-3xl font-bold">Suscríbete a Nuestro Newsletter</h2>
        <p class="mb-8 text-gray-300">
          Recibe las mejores ofertas y novedades directamente en tu correo
        </p>

        <div class="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="tu@email.com"
            class="flex-1 rounded-lg bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
          />
          <button class="whitespace-nowrap rounded-lg bg-[#d4a574] px-8 py-3 font-bold text-black transition-all duration-300 hover:bg-[#c89456]">
            Suscribirse
          </button>
        </div>
      </div>
    </section>

    <footer class="bg-[#1a1a1a] px-6 py-16 text-white">
      <div class="mx-auto mb-8 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 class="mb-4 text-xl font-bold text-[#d4a574]">Shopware</h3>
          <p class="text-sm text-gray-400">
            Tu tienda de moda online con los mejores estilos y precios del mercado.
          </p>
        </div>

        <div>
          <h4 class="mb-4 font-bold">Tienda</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="#catalogo" class="transition-colors hover:text-[#d4a574]">Novedades</a></li>
            <li><a href="#catalogo" class="transition-colors hover:text-[#d4a574]">Ofertas</a></li>
            <li><a href="#catalogo" class="transition-colors hover:text-[#d4a574]">Hombres</a></li>
            <li><a href="#catalogo" class="transition-colors hover:text-[#d4a574]">Mujeres</a></li>
          </ul>
        </div>

        <div>
          <h4 class="mb-4 font-bold">Ayuda</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="#" class="transition-colors hover:text-[#d4a574]">Contacto</a></li>
            <li><a href="#" class="transition-colors hover:text-[#d4a574]">Cambios y Devoluciones</a></li>
            <li><a href="#" class="transition-colors hover:text-[#d4a574]">Envíos</a></li>
            <li><a href="#" class="transition-colors hover:text-[#d4a574]">Preguntas Frecuentes</a></li>
          </ul>
        </div>

        <div>
          <h4 class="mb-4 font-bold">Síguenos</h4>
          <div class="flex gap-4">
            <a href="#" aria-label="Facebook" class="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4a574] transition-all hover:bg-white hover:text-[#d4a574]">
              <span class="font-bold">f</span>
            </a>
            <a href="#" aria-label="Twitter" class="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4a574] transition-all hover:bg-white hover:text-[#d4a574]">
              <span class="font-bold">𝕏</span>
            </a>
            <a href="#" aria-label="Instagram" class="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4a574] transition-all hover:bg-white hover:text-[#d4a574]">
              <span class="font-bold">◎</span>
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
        <p>&copy; 2026 Shopware. Todos los derechos reservados.</p>
        <div class="mt-4 flex justify-center gap-6 text-xs">
          <a href="#" class="transition-colors hover:text-[#d4a574]">Política de Privacidad</a>
          <a href="#" class="transition-colors hover:text-[#d4a574]">Términos de Servicio</a>
          <a href="#" class="transition-colors hover:text-[#d4a574]">Cookies</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const productos = ref([])
const categorias = ref([])
const usuario = ref(null)
const busqueda = ref('')
const categoriaSeleccionada = ref('todas')
const generoSeleccionado = ref(null)
const sidebarAbierta = ref(false)
const cargandoProductos = ref(true)
const cargandoCategorias = ref(true)
const errorCategorias = ref(false)

const beneficios = [
  { icono: '↗', titulo: 'Envío Rápido', descripcion: 'Entrega en 2-3 días hábiles' },
  { icono: '✓', titulo: 'Calidad Garantizada', descripcion: '100% satisfacción garantizada' },
  { icono: '◎', titulo: 'Soporte 24/7', descripcion: 'Equipo disponible siempre' },
  { icono: '$', titulo: 'Mejores Precios', descripcion: 'Descuentos y ofertas exclusivas' }
]

const categoriasRaiz = computed(() => {
  return categorias.value.filter((categoria) => {
    const nombre = String(categoria.nombre || '').trim().toLocaleLowerCase('es')
    return categoria.parentId === null && ['hombre', 'mujer'].includes(nombre)
  })
})

const tituloCategoria = computed(() => {
  if (categoriaSeleccionada.value === 'todas') {
    return 'Todos los productos'
  }

  if (String(categoriaSeleccionada.value).startsWith('genero:')) {
    const id = String(categoriaSeleccionada.value).split(':')[1]
    const genero = categoriasRaiz.value.find(
      (categoria) => String(categoria.idCategoria) === id
    )
    return genero ? `Productos para ${genero.nombre}` : 'Productos'
  }

  const categoria = categorias.value.find(
    (item) => String(item.idCategoria) === String(categoriaSeleccionada.value)
  )

  return categoria?.nombreCompleto || categoria?.nombre || 'Productos'
})

const estaAutenticado = computed(() => {
  return Boolean(
    localStorage.getItem('token') &&
    localStorage.getItem('usuario')
  )
})

const subcategoriasDe = (idCategoriaRaiz) => {
  return categorias.value.filter(
    (categoria) => Number(categoria.parentId) === Number(idCategoriaRaiz)
  )
}

const productosFiltrados = computed(() => {
  const termino = busqueda.value.toLocaleLowerCase('es').trim()

  return productos.value.filter((producto) => {
    const idCategoriaProducto = producto.categoria?.idCategoria
    let coincideCategoria = true

    if (String(categoriaSeleccionada.value).startsWith('genero:')) {
      const idRaiz = Number(categoriaSeleccionada.value.split(':')[1])
      const idsPermitidos = new Set([
        String(idRaiz),
        ...subcategoriasDe(idRaiz).map((categoria) => String(categoria.idCategoria))
      ])

      coincideCategoria = idsPermitidos.has(String(idCategoriaProducto))
    } else if (categoriaSeleccionada.value !== 'todas') {
      coincideCategoria =
        String(idCategoriaProducto) === String(categoriaSeleccionada.value)
    }

    const categoriaProducto = categorias.value.find(
      (categoria) =>
        String(categoria.idCategoria) === String(idCategoriaProducto)
    )

    const nombreProducto = String(producto.nombre || '').toLocaleLowerCase('es')
    const nombreCategoria = String(
      categoriaProducto?.nombreCompleto ||
      categoriaProducto?.nombre ||
      producto.categoria?.nombre ||
      ''
    ).toLocaleLowerCase('es')

    const coincideBusqueda =
      !termino ||
      nombreProducto.includes(termino) ||
      nombreCategoria.includes(termino)

    return coincideCategoria && coincideBusqueda
  })
})

const seleccionarGenero = (genero) => {
  const id = String(genero.idCategoria)

  if (String(generoSeleccionado.value) === id) {
    generoSeleccionado.value = null
    categoriaSeleccionada.value = 'todas'
    sidebarAbierta.value = true
    return
  }

  generoSeleccionado.value = genero.idCategoria
  categoriaSeleccionada.value = `genero:${genero.idCategoria}`
  sidebarAbierta.value = true
}

const seleccionarCategoria = (categoria) => {
  generoSeleccionado.value = categoria.parentId
  categoriaSeleccionada.value = String(categoria.idCategoria)
  sidebarAbierta.value = true
}

const mostrarTodosLosProductos = () => {
  generoSeleccionado.value = null
  categoriaSeleccionada.value = 'todas'
  sidebarAbierta.value = true
}

const irALogin = () => {
  sessionStorage.setItem(
    'redirectAfterLogin',
    router.currentRoute.value.fullPath
  )
  router.push('/login')
}

const irACarrito = () => {
  if (!estaAutenticado.value) {
    irALogin()
    return
  }

  router.push('/carrito')
}

const irAlLoginSiNoEstaAutenticado = () => {
  if (!estaAutenticado.value) {
    irALogin()
  }
}

const intentarAgregar = (producto) => {
  if (!estaAutenticado.value) {
    irALogin()
    return
  }

  alert(`Agregaste "${producto.nombre}" al carrito`)
}

const intentarComprar = (producto) => {
  if (!estaAutenticado.value) {
    irALogin()
    return
  }

  alert(`Listo para comprar "${producto.nombre}"`)
}

const formatPrice = (price) => {
  const numero = Number(price)
  return Number.isFinite(numero) ? numero.toFixed(2) : '0.00'
}

const precioFinal = (producto) => {
  const precio = Number(producto.precio)
  const descuento = Number(producto.descuento) || 0

  if (!Number.isFinite(precio)) return 0
  return precio * (1 - descuento / 100)
}

const urlImagen = (imagen) => {
  if (!imagen) {
    return 'https://via.placeholder.com/500x600?text=Shopware'
  }

  if (imagen.startsWith('http')) {
    return imagen
  }

  return `http://localhost:3000${imagen}`
}

const nombreCategoriaProducto = (producto) => {
  const idCategoria = producto.categoria?.idCategoria
  const categoria = categorias.value.find(
    (item) => String(item.idCategoria) === String(idCategoria)
  )

  return (
    categoria?.nombreCompleto ||
    categoria?.nombre ||
    producto.categoria?.nombre ||
    'Sin categoría'
  )
}

const obtenerProductos = async () => {
  cargandoProductos.value = true

  try {
    const response = await fetch('http://localhost:3000/api/products')

    if (!response.ok) {
      throw new Error('Error al cargar productos')
    }

    const resultado = await response.json()
    productos.value = Array.isArray(resultado) ? resultado : []
  } catch (error) {
    console.error('Error al cargar productos:', error)
    productos.value = []
  } finally {
    cargandoProductos.value = false
  }
}

const obtenerCategorias = async () => {
  cargandoCategorias.value = true
  errorCategorias.value = false

  try {
    const response = await fetch('http://localhost:3000/api/categories')

    if (!response.ok) {
      throw new Error('Error al cargar categorías')
    }

    const resultado = await response.json()
    categorias.value = Array.isArray(resultado) ? resultado : []
  } catch (error) {
    console.error('Error al cargar categorías:', error)
    errorCategorias.value = true
    categorias.value = []
  } finally {
    cargandoCategorias.value = false
  }
}

const mostrarOfertas = () => {
  busqueda.value = ''
  mostrarTodosLosProductos()
  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  usuario.value = null
  router.push('/login')
}

onMounted(() => {
  try {
    const usuarioGuardado = localStorage.getItem('usuario')
    usuario.value = usuarioGuardado ? JSON.stringify(usuarioGuardado) : null
  } catch (error) {
    console.error('No se pudo leer el usuario guardado:', error)
    usuario.value = null
  }

  obtenerProductos()
  obtenerCategorias()
})
</script>