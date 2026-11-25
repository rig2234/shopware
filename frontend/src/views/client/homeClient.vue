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
              ref="sidebarTrigger"
              class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-800 transition-colors hover:border-[#d4a574] hover:text-[#a8733e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a574]"
              :aria-label="sidebarAbierta ? 'Cerrar panel lateral' : 'Abrir panel lateral'"
              :aria-expanded="sidebarAbierta"
              aria-controls="sidebar-tienda"
              @click="alternarSidebar"
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
          id="sidebar-tienda"
          role="complementary"
          aria-label="Navegación de la tienda"
          class="fixed bottom-0 right-0 top-0 z-[60] w-[min(24rem,92vw)] overflow-y-auto border-l border-gray-200 bg-[#fbfaf8] p-5 pt-6 shadow-2xl transition-transform duration-300 ease-in-out sm:p-6"
          :class="sidebarAbierta ? 'translate-x-0' : 'translate-x-full'"
          :aria-hidden="!sidebarAbierta"
          :inert="!sidebarAbierta"
          @keydown.esc="cerrarSidebar"
        >
          <div class="mb-6 flex items-start justify-between">
            <div class="flex items-center gap-3">
              <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1a1a1a] text-[#e4ba8e]">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 7h16M4 12h16M4 17h10" />
                </svg>
              </span>
              <div>
                <h2 class="text-lg font-bold text-[#1a1a1a]">Tu espacio</h2>
                <p class="mt-0.5 text-xs text-gray-500">Explora y organiza tu compra</p>
              </div>
            </div>

            <button
              type="button"
              ref="sidebarCloseButton"
              class="rounded-xl p-2 text-gray-500 transition-colors hover:bg-white hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a574]"
              aria-label="Cerrar panel lateral"
              @click="cerrarSidebar"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav class="grid grid-cols-3 gap-2 rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm" aria-label="Secciones del panel lateral">
            <button
              type="button"
              :aria-pressed="seccionSidebar === 'categorias'"
              :class="seccionSidebar === 'categorias'
                ? 'bg-[#1a1a1a] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'"
              class="rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a574]"
              @click="seccionSidebar = 'categorias'"
            >
              Categorías
            </button>
            <button
              type="button"
              :aria-pressed="seccionSidebar === 'pedidos'"
              :class="seccionSidebar === 'pedidos'
                ? 'bg-[#1a1a1a] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'"
              class="rounded-xl px-2 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a574]"
              @click="abrirSeccionPedidos"
            >
              Pedidos
            </button>
            <button
              type="button"
              :aria-pressed="seccionSidebar === 'direccion'"
              :class="seccionSidebar === 'direccion'
                ? 'bg-[#1a1a1a] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'"
              class="rounded-xl px-2 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a574]"
              @click="abrirSeccionDireccion"
            >
              Dirección
            </button>
          </nav>

          <section v-show="seccionSidebar === 'categorias'" class="mt-5">
            <div class="mb-4 rounded-2xl bg-gradient-to-br from-[#27231f] to-[#51402f] p-4 text-white">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[#e4ba8e]">Colección Shopware</p>
              <p class="mt-1 text-sm text-white/80">Encuentra tu próximo estilo favorito.</p>
            </div>

            <button
              type="button"
              @click="mostrarTodosLosProductos"
              :class="categoriaSeleccionada === 'todas'
                ? 'bg-[#f1e4d5] text-[#865b33]'
                : 'text-gray-700 hover:bg-white'"
              class="mb-3 w-full rounded-xl px-4 py-3 text-left font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a574]"
            >
              Todos los productos
            </button>

            <p v-if="cargandoCategorias" class="rounded-xl bg-white px-4 py-3 text-sm text-gray-500" role="status">
              Cargando categorías...
            </p>

            <div v-else-if="errorCategorias" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              No se pudieron cargar las categorías.
            </div>

            <div v-else class="space-y-2">
              <div v-for="genero in categoriasRaiz" :key="genero.idCategoria" class="rounded-xl bg-white p-1 shadow-sm">
              <button
                type="button"
                @click="seleccionarGenero(genero)"
                :aria-expanded="String(generoSeleccionado) === String(genero.idCategoria)"
                :class="String(generoSeleccionado) === String(genero.idCategoria)
                  ? 'bg-[#f8f1e9] text-[#a8733e]'
                  : 'text-gray-800 hover:bg-gray-100'"
                class="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a574]"
              >
                <span>{{ genero.nombre }}</span>
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-[#f7f3ee] text-sm" aria-hidden="true">
                  {{ String(generoSeleccionado) === String(genero.idCategoria) ? '−' : '+' }}
                </span>
              </button>

              <div
                v-if="String(generoSeleccionado) === String(genero.idCategoria)"
                class="ml-3 mt-1 space-y-1 border-l-2 border-[#ead8c3] py-1 pl-3"
              >
                <button
                  type="button"
                  @click="seleccionarGenero(genero)"
                  :class="categoriaSeleccionada === `genero:${genero.idCategoria}`
                    ? 'bg-[#f8f1e9] font-semibold text-[#a8733e]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#a8733e]'"
                  class="w-full rounded-md px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a574]"
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
                  class="w-full rounded-md px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a574]"
                >
                  {{ categoria.nombre }}
                </button>
              </div>
            </div>
          </div>
          </section>

          <section v-show="seccionSidebar === 'pedidos'" class="mt-5">
            <div class="mb-4">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[#a8733e]">Compras</p>
              <h3 class="mt-1 text-xl font-bold text-[#1a1a1a]">Mis pedidos</h3>
              <p class="mt-1 text-sm leading-5 text-gray-600">
                Consulta el estado y seguimiento de tus pedidos.
              </p>
            </div>

            <div v-if="!estaAutenticado" class="rounded-2xl border border-[#ead8c3] bg-white p-5 shadow-sm">
              <p class="font-semibold text-gray-900">Inicia sesión para ver tus pedidos</p>
              <button
                type="button"
                class="mt-4 w-full rounded-xl bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3b342e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a574] focus-visible:ring-offset-2"
                @click="irALogin"
              >
                Iniciar sesión
              </button>
            </div>

            <p v-else-if="cargandoPedidos" class="rounded-xl bg-white px-4 py-3 text-sm text-gray-500" role="status">
              Cargando tus pedidos...
            </p>

            <div v-else-if="errorPedidos" class="rounded-xl bg-red-50 px-4 py-4 text-sm text-red-700" role="alert">
              <p>{{ errorPedidos }}</p>
              <button
                type="button"
                class="mt-3 font-semibold underline"
                @click="cargarPedidos"
              >
                Intentar de nuevo
              </button>
            </div>

            <div v-else-if="!pedidos.length" class="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
              <p class="font-semibold text-gray-900">Aún no tienes pedidos</p>
              <p class="mt-1 text-sm text-gray-500">Tus compras aparecerán aquí.</p>
            </div>

            <div v-else class="space-y-4">
              <article
                v-for="pedido in pedidos"
                :key="pedido.idPedido"
                class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h4 class="font-bold text-gray-900">Pedido #{{ pedido.idPedido }}</h4>
                    <p class="mt-1 text-xs text-gray-500">{{ formatearFechaPedido(pedido.fechaPedido) }}</p>
                  </div>
                  <span class="shrink-0 rounded-full bg-[#f8f1e9] px-2.5 py-1 text-xs font-semibold text-[#8b633d]">
                    {{ estadoEnvioPedido(pedido.fechaPedido) }}
                  </span>
                </div>

                <div class="mt-4">
                  <div class="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      class="h-full rounded-full bg-[#a8733e] transition-[width] duration-700"
                      :style="{ width: `${progresoEnvioPedido(pedido.fechaPedido)}%` }"
                    ></div>
                  </div>
                  <ol class="mt-2 grid grid-cols-3 text-center text-[0.65rem] font-medium">
                    <li
                      v-for="(etapa, indice) in etapasEnvio"
                      :key="etapa"
                      :class="indice + 1 <= pasoEnvioPedido(pedido.fechaPedido) ? 'text-[#8b6847]' : 'text-gray-400'"
                    >
                      {{ etapa }}
                    </li>
                  </ol>
                </div>

                <ul class="mt-4 space-y-1 border-t border-gray-100 pt-3 text-sm text-gray-600">
                  <li v-for="(detalle, indice) in pedido.detalles" :key="`${pedido.idPedido}-${indice}`">
                    {{ detalle.producto?.nombre || 'Producto' }}
                    <span class="text-gray-400">
                      · {{ detalle.productoTalla?.talla?.nombre || 'Sin talla' }} · ×{{ detalle.cantidad }}
                    </span>
                  </li>
                </ul>

                <div class="mt-3 flex items-center justify-between gap-3">
                  <p class="text-sm font-bold text-[#8b6847]">${{ formatPrice(pedido.total) }}</p>
                  <router-link
                    :to="{ name: 'Pago', query: { pedido: String(pedido.idPedido) } }"
                    class="text-sm font-semibold text-[#8b6847] underline decoration-[#d4a574] underline-offset-2 hover:text-[#a8733e]"
                    @click="cerrarSidebar"
                  >
                    Ver seguimiento
                  </router-link>
                </div>
              </article>
            </div>
          </section>

          <section v-show="seccionSidebar === 'direccion'" class="mt-5">
            <div class="mb-4">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[#a8733e]">Entrega</p>
              <h3 class="mt-1 text-xl font-bold text-[#1a1a1a]">Mi dirección</h3>
              <p class="mt-1 text-sm leading-5 text-gray-600">
                Guarda la dirección de entrega asociada a tu cuenta.
              </p>
            </div>

            <div v-if="!estaAutenticado" class="rounded-2xl border border-[#ead8c3] bg-white p-5 shadow-sm">
              <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8f1e9] text-[#a8733e]">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 11V7a4 4 0 00-8 0v4m-1 0h18v10H3V11zm9 4v2" />
                </svg>
              </div>
              <p class="font-semibold text-gray-900">Inicia sesión para continuar</p>
              <p class="mt-1 text-sm leading-5 text-gray-600">
                Tu dirección se guardará de forma privada en tu cuenta.
              </p>
              <button
                type="button"
                class="mt-4 w-full rounded-xl bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3b342e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a574] focus-visible:ring-offset-2"
                @click="irALogin"
              >
                Iniciar sesión
              </button>
            </div>

            <template v-else>
              <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p v-if="cargandoDireccion" class="py-2 text-sm text-gray-500" role="status">
                  Cargando tu dirección...
                </p>
                <form v-else @submit.prevent="guardarDireccion">
                  <label for="direccion-entrega" class="mb-2 block text-sm font-semibold text-gray-800">
                    Dirección de entrega (obligatoria)
                  </label>
                  <textarea
                    id="direccion-entrega"
                    ref="direccionInput"
                    v-model="direccion"
                    name="direccion"
                    autocomplete="street-address"
                    maxlength="100"
                    rows="3"
                    required
                    placeholder="Calle, número, colonia y referencias"
                    class="w-full resize-y rounded-xl border border-gray-300 bg-[#fcfbf9] px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-[#c89456] focus:ring-2 focus:ring-[#d4a574]/30"
                    :aria-describedby="errorDireccion
                      ? 'ayuda-direccion contador-direccion error-direccion'
                      : 'ayuda-direccion contador-direccion'"
                    :aria-invalid="direccionInvalida"
                    @input="limpiarEstadoDireccion"
                  ></textarea>
                  <div class="mt-1 flex justify-between gap-3 text-xs text-gray-500">
                    <span id="ayuda-direccion">Máximo 100 caracteres.</span>
                    <span id="contador-direccion">{{ direccion.length }}/100</span>
                  </div>

                  <p v-if="errorDireccion" id="error-direccion" class="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                    {{ errorDireccion }}
                  </p>
                  <p v-if="mensajeDireccion" class="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700" role="status">
                    {{ mensajeDireccion }}
                  </p>

                  <button
                    type="submit"
                    :disabled="guardandoDireccion"
                    class="mt-4 w-full rounded-xl bg-[#d4a574] px-4 py-3 text-sm font-bold text-[#1a1a1a] transition-colors hover:bg-[#c89456] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8733e] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {{ guardandoDireccion ? 'Guardando...' : 'Guardar dirección' }}
                  </button>
                </form>
              </div>

              <div class="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div class="p-4 pb-3">
                  <h4 class="font-semibold text-gray-900">Referencia en el mapa</h4>
                  <p class="mt-1 text-xs leading-5 text-gray-600">
                    Selecciona un punto para completar la dirección de entrega. Revisa el campo y guarda los cambios.
                  </p>
                </div>
                <div
                  ref="contenedorMapa"
                  class="h-64 w-full bg-[#e8e5df]"
                  role="region"
                  aria-label="Mapa interactivo centrado en Culiacán, Sinaloa"
                  tabindex="0"
                ></div>
                <div class="p-4 pt-3">
                  <p v-if="coordenadasReferencia" class="text-xs text-gray-600" aria-live="polite">
                    Punto de referencia: {{ coordenadasReferencia.lat }}, {{ coordenadasReferencia.lng }}
                    <button
                      type="button"
                      class="ml-1 font-semibold text-[#8b5e34] underline underline-offset-2 hover:text-[#5c3c21]"
                      @click="limpiarReferencia"
                    >
                      Quitar marca
                    </button>
                  </p>
                  <p v-if="buscandoDireccionMapa" class="mt-2 text-xs text-gray-600" role="status">
                    Buscando la dirección del punto seleccionado...
                  </p>
                  <p v-if="errorGeocodificacion" class="mt-2 text-xs text-amber-700" role="status">
                    {{ errorGeocodificacion }}
                  </p>
                  <p v-if="errorMapa" class="mt-2 text-xs text-amber-700" role="status">
                    {{ errorMapa }}
                  </p>
                  <p class="mt-2 text-[11px] leading-4 text-gray-500">
                    © OpenStreetMap contributors · Teselas sujetas a disponibilidad y política de uso.
                  </p>
                </div>
              </div>
            </template>
          </section>
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
  @click="abrirProducto(producto)"
  class="flex-1 rounded-lg bg-[#1a1a1a] py-2 text-sm font-semibold text-white hover:bg-[#d4a574] hover:text-[#1a1a1a]"
>
  Elegir talla
</button>

                <button
  type="button"
  @click="abrirProducto(producto)"
  class="rounded-lg border-2 border-gray-300 px-3 py-2 hover:border-[#d4a574] hover:text-[#d4a574]"
  title="Ver producto"
  aria-label="Ver producto"
>
  <!-- Conserva aquí el SVG del botón actual -->
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()

const productos = ref([])
const categorias = ref([])
const usuario = ref(null)
const busqueda = ref('')
const categoriaSeleccionada = ref('todas')
const generoSeleccionado = ref(null)
const sidebarAbierta = ref(false)
const seccionSidebar = ref('categorias')
const sidebarTrigger = ref(null)
const sidebarCloseButton = ref(null)
const cargandoProductos = ref(true)
const cargandoCategorias = ref(true)
const errorCategorias = ref(false)
const direccion = ref('')
const direccionInput = ref(null)
const cargandoDireccion = ref(false)
const guardandoDireccion = ref(false)
const direccionCargada = ref(false)
const errorDireccion = ref('')
const direccionInvalida = ref(false)
const mensajeDireccion = ref('')
const pedidos = ref([])
const cargandoPedidos = ref(false)
const pedidosCargados = ref(false)
const errorPedidos = ref('')
const tiempoActualPedidos = ref(Date.now())
const contenedorMapa = ref(null)
const coordenadasReferencia = ref(null)
const errorMapa = ref('')
const buscandoDireccionMapa = ref(false)
const errorGeocodificacion = ref('')

const centroCuliacan = [24.8091, -107.394]
let mapaDireccion = null
let marcadorDireccion = null
let temporizadorGeocodificacion = null
let controladorGeocodificacion = null
let solicitudGeocodificacion = 0
let ultimaSolicitudGeocodificacion = 0
let intervaloPedidos = null

const etapasEnvio = ['Preparando', 'En camino', 'Entregado']

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

const cerrarSidebar = () => {
  sidebarAbierta.value = false
  nextTick(() => sidebarTrigger.value?.focus())
}

const alternarSidebar = () => {
  if (sidebarAbierta.value) {
    cerrarSidebar()
    return
  }

  sidebarAbierta.value = true
  nextTick(() => sidebarCloseButton.value?.focus())
}

const abrirSeccionDireccion = () => {
  seccionSidebar.value = 'direccion'
  sidebarAbierta.value = true

  if (estaAutenticado.value && !direccionCargada.value) {
    cargarDireccion()
  }
}

const abrirSeccionPedidos = () => {
  seccionSidebar.value = 'pedidos'
  sidebarAbierta.value = true

  if (estaAutenticado.value && !pedidosCargados.value) {
    cargarPedidos()
  }
}

const cargarPedidos = async () => {
  if (!estaAutenticado.value || cargandoPedidos.value) return

  cargandoPedidos.value = true
  errorPedidos.value = ''

  try {
    const response = await fetch('http://localhost:3000/api/payments/orders', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'No se pudieron cargar tus pedidos')
    }

    pedidos.value = Array.isArray(data) ? data : []
    pedidosCargados.value = true
  } catch (error) {
    console.error('Error al cargar los pedidos:', error)
    errorPedidos.value = error.message || 'No se pudieron cargar tus pedidos'
  } finally {
    cargandoPedidos.value = false
  }
}

const pasoEnvioPedido = (fechaPedido) => {
  const timestamp = Date.parse(fechaPedido)
  const segundos = Number.isFinite(timestamp)
    ? Math.max(0, Math.floor((tiempoActualPedidos.value - timestamp) / 1000))
    : 0

  if (segundos < 10) return 1
  if (segundos < 70) return 2
  return 3
}

const estadoEnvioPedido = (fechaPedido) =>
  ['Pedido en preparación', 'Pedido en camino', 'Pedido entregado'][
    pasoEnvioPedido(fechaPedido) - 1
  ]

const progresoEnvioPedido = (fechaPedido) =>
  [15, 65, 100][pasoEnvioPedido(fechaPedido) - 1]

const formatearFechaPedido = (fechaPedido) => {
  if (!fechaPedido) return 'Fecha no disponible'

  const fecha = new Date(fechaPedido)
  return Number.isNaN(fecha.getTime())
    ? 'Fecha no disponible'
    : new Intl.DateTimeFormat('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(fecha)
}

const cargarDireccion = async () => {
  if (!estaAutenticado.value || cargandoDireccion.value || direccionCargada.value) {
    return
  }

  cargandoDireccion.value = true
  errorDireccion.value = ''

  try {
    const response = await fetch('http://localhost:3000/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'No se pudo cargar tu dirección')
    }

    direccion.value = data.direccion || ''
    direccionCargada.value = true
  } catch (error) {
    console.error('Error al cargar la dirección:', error)
    errorDireccion.value = error.message || 'No se pudo cargar tu dirección'
  } finally {
    cargandoDireccion.value = false
    direccionCargada.value = true
  }
}

const limpiarEstadoDireccion = () => {
  cancelarGeocodificacion()
  errorDireccion.value = ''
  mensajeDireccion.value = ''
  direccionInvalida.value = false
  errorGeocodificacion.value = ''
}

const guardarDireccion = async () => {
  limpiarEstadoDireccion()

  if (!direccion.value.trim()) {
    errorDireccion.value = 'Escribe una dirección válida.'
    direccionInvalida.value = true
    direccionInput.value?.focus()
    return
  }

  guardandoDireccion.value = true

  try {
    const response = await fetch('http://localhost:3000/api/auth/profile/address', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ direccion: direccion.value })
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'No se pudo guardar tu dirección')
    }

    direccion.value = data.direccion
    direccionCargada.value = true
    mensajeDireccion.value = 'Tu dirección se guardó correctamente.'
  } catch (error) {
    console.error('Error al guardar la dirección:', error)
    errorDireccion.value = error.message || 'No se pudo guardar tu dirección'
  } finally {
    guardandoDireccion.value = false
  }
}

const limpiarReferencia = () => {
  cancelarGeocodificacion()
  marcadorDireccion?.remove()
  marcadorDireccion = null
  coordenadasReferencia.value = null
}

const cancelarGeocodificacion = () => {
  clearTimeout(temporizadorGeocodificacion)
  temporizadorGeocodificacion = null
  controladorGeocodificacion?.abort()
  controladorGeocodificacion = null
  solicitudGeocodificacion += 1
  buscandoDireccionMapa.value = false
}

const formatearDireccion = (resultado) => {
  const partesDireccion = resultado.address || {}
  const calle = [
    partesDireccion.house_number,
    partesDireccion.road ||
      partesDireccion.pedestrian ||
      partesDireccion.residential ||
      partesDireccion.footway
  ].filter(Boolean).join(' ')
  const colonia =
    partesDireccion.suburb ||
    partesDireccion.neighbourhood ||
    partesDireccion.quarter ||
    partesDireccion.city_district
  const localidad =
    partesDireccion.city ||
    partesDireccion.town ||
    partesDireccion.village ||
    partesDireccion.municipality ||
    partesDireccion.county
  const partes = [calle, colonia, localidad, partesDireccion.state]
    .filter(Boolean)
    .filter((parte, indice, lista) => lista.indexOf(parte) === indice)

  let direccionFormateada = ''
  for (const parte of partes) {
    const siguienteDireccion = direccionFormateada
      ? `${direccionFormateada}, ${parte}`
      : parte

    if (siguienteDireccion.length > 100) {
      break
    }

    direccionFormateada = siguienteDireccion
  }

  return direccionFormateada || String(resultado.display_name || '').slice(0, 100)
}

const buscarDireccionDelPunto = ({ lat, lng }) => {
  clearTimeout(temporizadorGeocodificacion)
  controladorGeocodificacion?.abort()

  const idSolicitud = ++solicitudGeocodificacion
  const controlador = new AbortController()
  controladorGeocodificacion = controlador
  buscandoDireccionMapa.value = true
  errorGeocodificacion.value = ''

  const esperaMinima = Math.max(0, 1000 - (Date.now() - ultimaSolicitudGeocodificacion))
  temporizadorGeocodificacion = setTimeout(async () => {
    temporizadorGeocodificacion = null
    ultimaSolicitudGeocodificacion = Date.now()

    try {
      const parametros = new URLSearchParams({
        format: 'jsonv2',
        lat: String(lat),
        lon: String(lng),
        addressdetails: '1',
        'accept-language': 'es'
      })
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${parametros}`,
        { signal: controlador.signal }
      )

      if (!response.ok) {
        throw new Error('No se pudo obtener la dirección del punto.')
      }

      const resultado = await response.json()
      const direccionEncontrada = formatearDireccion(resultado)

      if (!direccionEncontrada) {
        throw new Error('No se encontró una dirección para este punto.')
      }

      if (idSolicitud !== solicitudGeocodificacion) {
        return
      }

      direccion.value = direccionEncontrada
      errorDireccion.value = ''
      direccionInvalida.value = false
      mensajeDireccion.value = 'Dirección completada desde el punto seleccionado. Guarda los cambios.'
    } catch (error) {
      if (error.name === 'AbortError' || idSolicitud !== solicitudGeocodificacion) {
        return
      }

      console.error('Error al buscar la dirección del punto:', error)
      errorGeocodificacion.value = error.message || 'No se pudo obtener la dirección del punto.'
    } finally {
      if (idSolicitud === solicitudGeocodificacion) {
        controladorGeocodificacion = null
        buscandoDireccionMapa.value = false
      }
    }
  }, esperaMinima)
}

const inicializarMapaDireccion = async () => {
  if (!sidebarAbierta.value || seccionSidebar.value !== 'direccion' || !estaAutenticado.value) {
    return
  }

  await nextTick()

  if (
    !sidebarAbierta.value ||
    seccionSidebar.value !== 'direccion' ||
    !estaAutenticado.value ||
    !contenedorMapa.value
  ) {
    return
  }

  if (mapaDireccion) {
    mapaDireccion.invalidateSize()
    return
  }

  try {
    mapaDireccion = L.map(contenedorMapa.value, { scrollWheelZoom: false })
      .setView(centroCuliacan, 13)

    const capa = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    capa.on('tileerror', () => {
      errorMapa.value = 'No se pudieron cargar algunas partes del mapa. Revisa tu conexión.'
    })
    capa.on('load', () => {
      errorMapa.value = ''
    })
    capa.addTo(mapaDireccion)

    mapaDireccion.on('click', (evento) => {
      const { lat, lng } = evento.latlng
      coordenadasReferencia.value = {
        lat: lat.toFixed(5),
        lng: lng.toFixed(5)
      }

      if (!marcadorDireccion) {
        marcadorDireccion = L.circleMarker(evento.latlng, {
          radius: 8,
          color: '#ffffff',
          weight: 2,
          fillColor: '#a8733e',
          fillOpacity: 1
        }).addTo(mapaDireccion)
      } else {
        marcadorDireccion.setLatLng(evento.latlng)
      }

      buscarDireccionDelPunto({ lat, lng })
    })
  } catch (error) {
    console.error('Error al inicializar el mapa:', error)
    errorMapa.value = 'No se pudo inicializar el mapa.'
    mapaDireccion?.remove()
    mapaDireccion = null
  }
}

watch(
  [sidebarAbierta, seccionSidebar],
  ([abierta, seccion]) => {
    if (abierta && seccion === 'direccion') {
      inicializarMapaDireccion()
    }
  },
  { flush: 'post' }
)

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
    sessionStorage.setItem('redirectAfterLogin', '/carrito')
    router.push('/login')
    return
  }

  router.push('/carrito')
}

const irAlLoginSiNoEstaAutenticado = () => {
  if (!estaAutenticado.value) {
    irALogin()
  }
}

const agregarAlCarrito = async (producto) => {
  const response = await fetch('http://localhost:3000/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      idProducto: producto.idProducto,
      cantidad: 1
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo agregar el producto')
  }

  alert(`Agregaste "${producto.nombre}" al carrito`)
}

const intentarAgregar = async (producto) => {
  if (!estaAutenticado.value) {
    sessionStorage.setItem('pendingCartProduct', String(producto.idProducto))
    irALogin()
    return
  }

  try {
    await agregarAlCarrito(producto)
  } catch (error) {
    alert(error.message)
  }
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

  const productoPendiente = sessionStorage.getItem('pendingCartProduct')

if (productoPendiente && localStorage.getItem('token')) {
  const producto = productos.value.find(
    (item) => String(item.idProducto) === productoPendiente
  )

  if (producto) {
    sessionStorage.removeItem('pendingCartProduct')
    agregarAlCarrito(producto).catch((error) => alert(error.message))
  }
}

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

const abrirProducto = (producto) => {
  router.push({
    name: 'Producto',
    params: { id: producto.idProducto }
  })
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  usuario.value = null
  router.push('/login')
}

onMounted(() => {
  intervaloPedidos = setInterval(() => {
    tiempoActualPedidos.value = Date.now()
  }, 1000)

  try {
    const usuarioGuardado = localStorage.getItem('usuario')
    usuario.value = usuarioGuardado ? JSON.parse(usuarioGuardado) : null
  } catch (error) {
    console.error('No se pudo leer el usuario guardado:', error)
    usuario.value = null
  }

  const productoPendiente = sessionStorage.getItem('pendingCartProduct')

  if (productoPendiente && localStorage.getItem('token')) {
    sessionStorage.removeItem('pendingCartProduct')

    const producto = productos.value.find(
      (item) => String(item.idProducto) === productoPendiente
    )

    // Los productos todavía se están cargando; se retoma cuando termine la carga.
    if (producto) {
      agregarAlCarrito(producto).catch((error) => alert(error.message))
    } else {
      sessionStorage.setItem('pendingCartProduct', productoPendiente)
    }
  }

  obtenerProductos()
  obtenerCategorias()
})

onBeforeUnmount(() => {
  if (intervaloPedidos) {
    clearInterval(intervaloPedidos)
    intervaloPedidos = null
  }
  cancelarGeocodificacion()
  mapaDireccion?.remove()
  mapaDireccion = null
})
</script>