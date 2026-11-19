<template>
  <main class="min-h-screen bg-[#f7f5f2] px-4 py-8 text-[#292521] sm:px-6 lg:py-12">
    <div class="mx-auto max-w-6xl">
      <header class="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#a8733e]">
            Shopware
          </p>
          <h1 class="text-3xl font-bold sm:text-4xl">Mi carrito</h1>
          <p class="mt-2 text-sm text-gray-500">
            Revisa tus productos antes de continuar.
          </p>
        </div>

        <router-link
          to="/tienda"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold transition hover:border-[#d4a574] hover:text-[#a8733e]"
        >
          ← Seguir comprando
        </router-link>
      </header>

      <div
        v-if="cargando"
        class="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm"
      >
        Cargando tu carrito...
      </div>

      <section
        v-else-if="error"
        class="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm"
      >
        <p class="font-semibold text-red-700">{{ error }}</p>
        <button
          type="button"
          class="mt-4 rounded-lg bg-[#292521] px-5 py-2 text-sm font-semibold text-white hover:bg-[#a8733e]"
          @click="cargarCarrito"
        >
          Intentar de nuevo
        </button>
      </section>

      <section
        v-else-if="items.length"
        class="grid items-start gap-6 lg:grid-cols-[1fr_340px]"
      >
        <div class="space-y-4">
          <article
            v-for="item in items"
            :key="item.idCarrito"
            class="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
          >
            <div class="flex flex-col gap-4 sm:flex-row">
              <img
                :src="urlImagen(item.producto?.imagen)"
                :alt="item.producto?.nombre || 'Producto Shopware'"
                class="h-48 w-full rounded-xl bg-gray-100 object-cover sm:h-36 sm:w-32"
              />

              <div class="flex min-w-0 flex-1 flex-col justify-between gap-4">
                <div>
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Producto
                      </p>
                      <h2 class="mt-1 text-lg font-bold">
                        {{ item.producto?.nombre || 'Producto no disponible' }}
                      </h2>
                    </div>

                    <button
                      type="button"
                      class="text-sm font-medium text-red-600 transition hover:text-red-800 disabled:opacity-50"
                      :disabled="eliminando === item.idCarrito"
                      @click="eliminarItem(item.idCarrito)"
                    >
                      {{ eliminando === item.idCarrito ? 'Eliminando…' : 'Eliminar' }}
                    </button>
                  </div>

                  <div class="mt-3 flex flex-wrap gap-2 text-sm">
                    <span class="rounded-full bg-[#f7f1e9] px-3 py-1 text-[#8b633d]">
                      Talla:
                      <strong>
                        {{ item.productoTalla?.talla?.nombre || 'No especificada' }}
                      </strong>
                    </span>
                    <span class="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
                      Cantidad: {{ item.cantidad }}
                    </span>
                  </div>
                </div>

                <div class="flex items-end justify-between border-t border-gray-100 pt-3">
                  <p class="text-sm text-gray-500">
                    ${{ formatPrice(item.precioUnitario) }} por unidad
                  </p>
                  <p class="text-lg font-bold text-[#a8733e]">
                    ${{ formatPrice(item.subtotal) }}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>

        <aside class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-6">
          <h2 class="text-xl font-bold">Resumen del pedido</h2>

          <div class="mt-5 space-y-3 border-b border-gray-100 pb-5 text-sm">
            <div class="flex justify-between text-gray-600">
              <span>Productos</span>
              <span>{{ cantidadProductos }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Envío</span>
              <span class="text-gray-500">Se calculará después</span>
            </div>
          </div>

          <div class="flex justify-between py-5 text-lg font-bold">
            <span>Subtotal</span>
            <span class="text-[#a8733e]">${{ formatPrice(total) }}</span>
          </div>

          <button
            type="button"
            class="w-full cursor-not-allowed rounded-xl bg-[#d4a574] px-5 py-3 font-bold text-white opacity-80"
            title="La pasarela de pago se implementará más adelante"
            @click="alertaCompra"
          >
            Continuar con la compra
          </button>

          <p class="mt-3 text-center text-xs leading-relaxed text-gray-500">
            La compra y el pago estarán disponibles próximamente.
          </p>
        </aside>
      </section>

      <section
        v-else
        class="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm"
      >
        <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f1e9] text-3xl text-[#a8733e]" aria-hidden="true">
          🛍️
        </div>
        <h2 class="text-2xl font-bold">Tu carrito está vacío</h2>
        <p class="mx-auto mt-2 max-w-md text-gray-500">
          Explora la tienda y agrega los productos que te gusten.
        </p>
        <router-link
          to="/tienda"
          class="mt-6 inline-flex rounded-xl bg-[#292521] px-6 py-3 font-semibold text-white transition hover:bg-[#a8733e]"
        >
          Explorar productos
        </router-link>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const items = ref([])
const cargando = ref(true)
const error = ref('')
const eliminando = ref(null)

const total = computed(() =>
  items.value.reduce((suma, item) => suma + Number(item.subtotal || 0), 0)
)

const cantidadProductos = computed(() =>
  items.value.reduce((suma, item) => suma + Number(item.cantidad || 0), 0)
)

const formatPrice = (price) => {
  const numero = Number(price)
  return Number.isFinite(numero) ? numero.toFixed(2) : '0.00'
}

const urlImagen = (imagen) => {
  if (!imagen) return 'https://via.placeholder.com/300x360?text=Shopware'
  if (imagen.startsWith('http')) return imagen
  return `http://localhost:3000${imagen}`
}

const cargarCarrito = async () => {
  cargando.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('token')

    if (!token) {
      sessionStorage.setItem('redirectAfterLogin', '/carrito')
      await router.push('/login')
      return
    }

    const response = await fetch('http://localhost:3000/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'No se pudo cargar el carrito')
    }

    items.value = Array.isArray(data) ? data : []
  } catch (err) {
    error.value = err.message || 'Ocurrió un error al cargar el carrito'
  } finally {
    cargando.value = false
  }
}

const eliminarItem = async (idCarrito) => {
  eliminando.value = idCarrito
  error.value = ''

  try {
    const response = await fetch(`http://localhost:3000/api/cart/${idCarrito}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'No se pudo eliminar el producto')
    }

    items.value = items.value.filter((item) => item.idCarrito !== idCarrito)
  } catch (err) {
    error.value = err.message || 'No se pudo eliminar el producto'
  } finally {
    eliminando.value = null
  }
}

const alertaCompra = () => {
  alert('La pasarela de pago se implementará más adelante.')
}

onMounted(cargarCarrito)
</script>