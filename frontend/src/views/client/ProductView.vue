<template>
  <main class="min-h-screen bg-[#f7f5f2] px-4 py-6 text-[#292521] sm:px-6 sm:py-10">
    <div class="mx-auto max-w-7xl">
      <header class="mb-8 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Ruta de navegación">
          <ol class="flex flex-wrap items-center gap-2 text-sm">
            <li>
              <router-link to="/tienda" class="text-[#8b6847] transition-colors hover:text-[#292521]">
                Tienda
              </router-link>
            </li>
            <li aria-hidden="true" class="text-gray-400">/</li>
            <li aria-current="page" class="max-w-[14rem] truncate font-medium">
              {{ producto?.nombre || 'Producto' }}
            </li>
          </ol>
        </nav>

        <button
          type="button"
          class="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d9d2c8] bg-white px-5 text-sm font-semibold text-[#292521] shadow-sm transition hover:border-[#a8733e] hover:text-[#8b6847] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8733e]"
          @click="irACarrito"
        >
          <i class="pi pi-shopping-bag" aria-hidden="true"></i>
          Ver carrito
        </button>
      </header>

      <section
        v-if="cargando"
        aria-live="polite"
        class="grid min-h-[28rem] place-items-center rounded-[2rem] border border-[#eee7de] bg-white shadow-sm"
      >
        <div class="text-center">
          <div class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#eadfce] border-t-[#a8733e] motion-reduce:animate-none"></div>
          <p class="font-medium text-gray-500">Cargando producto...</p>
        </div>
      </section>

      <section
        v-else-if="error"
        class="rounded-[2rem] border border-red-100 bg-white px-6 py-16 text-center shadow-sm"
      >
        <i class="pi pi-exclamation-circle mb-4 text-4xl text-red-500" aria-hidden="true"></i>
        <p role="alert" class="text-lg font-semibold text-red-700">{{ error }}</p>
        <button
          type="button"
          class="mt-6 rounded-full bg-[#292521] px-6 py-3 font-semibold text-white transition hover:bg-[#a8733e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8733e]"
          @click="cargarProducto"
        >
          Intentar de nuevo
        </button>
      </section>

      <section v-else-if="producto" class="@container">
        <div class="grid grid-cols-1 items-center gap-8 rounded-[2rem] border border-[#eee7de] bg-white p-4 shadow-[0_24px_70px_-48px_rgba(54,39,22,0.45)] sm:gap-12 sm:p-8 @4xl:grid-cols-2 @4xl:gap-16 lg:p-12">
          <div class="relative aspect-[4/5] max-h-[720px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#f0e9df] via-[#f7f4ef] to-[#e9dfd2]">
            <div class="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#d4a574]/20 blur-3xl" aria-hidden="true"></div>
            <div class="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-white/70 blur-3xl" aria-hidden="true"></div>
            <img
              :src="urlImagen(producto.imagen)"
              :alt="producto.nombre || 'Producto Shopware'"
              class="relative z-10 h-full w-full object-contain p-6 sm:p-10"
            />
            <span
              v-if="Number(producto.descuento) > 0"
              class="absolute left-5 top-5 z-20 rounded-full bg-[#292521] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg"
            >
              -{{ Number(producto.descuento) }}%
            </span>
          </div>

          <div class="flex flex-col py-2 sm:py-4">
            <p class="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#a8733e]">
              {{ producto.categoria?.nombre || 'Shopware' }}
            </p>

            <h1 class="text-3xl font-semibold leading-tight tracking-tight text-[#292521] sm:text-4xl lg:text-5xl">
              {{ producto.nombre }}
            </h1>

            <div class="my-7 flex flex-wrap items-end gap-x-4 gap-y-2 border-b border-[#eee7de] pb-7">
              <p class="text-4xl font-semibold tracking-tight text-[#a8733e]">
                ${{ formatPrice(precioFinal) }}
              </p>
              <p
                v-if="Number(producto.descuento) > 0"
                class="pb-1 text-lg text-gray-400 line-through"
              >
                ${{ formatPrice(producto.precio) }}
              </p>
              <span
                v-if="Number(producto.descuento) > 0"
                class="mb-1 rounded-full bg-[#f7eee2] px-3 py-1 text-xs font-semibold text-[#8b6847]"
              >
                Ahorras ${{ formatPrice(Number(producto.precio) - precioFinal) }}
              </span>
            </div>

            <div class="mb-3 flex flex-wrap items-center gap-2 text-sm">
              <span
                class="h-2.5 w-2.5 rounded-full"
                :class="tallasDisponibles ? 'bg-emerald-500' : 'bg-red-500'"
                aria-hidden="true"
              ></span>
              <p v-if="tallas.length && tallasDisponibles" role="status" class="font-medium text-gray-700">
                Disponible en {{ tallasDisponibles }} {{ tallasDisponibles === 1 ? 'talla' : 'tallas' }}
              </p>
              <p v-else-if="tallas.length" role="status" class="font-medium text-red-700">
                Producto agotado en todas las tallas
              </p>
              <p v-else role="status" class="font-medium text-gray-500">
                No hay tallas configuradas
              </p>
            </div>

            <fieldset class="mb-7">
              <legend class="mb-3 text-sm font-semibold text-[#292521]">
                Selecciona una talla
              </legend>

              <div v-if="tallas.length" class="flex flex-wrap gap-3">
                <button
                  v-for="item in tallas"
                  :key="item.idProductoTalla"
                  type="button"
                  :disabled="getStock(item) === 0"
                  :aria-label="`Talla ${item.talla?.nombre || 'sin nombre'}${getStock(item) === 0 ? ', agotada' : ''}`"
                  :aria-pressed="tallaSeleccionada === item.idProductoTalla"
                  :class="[
                    tallaSeleccionada === item.idProductoTalla
                      ? 'border-[#a8733e] bg-[#a8733e] text-white shadow-md shadow-[#a8733e]/20'
                      : 'border-[#ded8cf] bg-white text-[#292521]',
                    getStock(item) === 0
                      ? 'cursor-not-allowed border-dashed bg-[#f4f1ed] text-gray-500'
                      : 'transition hover:border-[#a8733e] hover:bg-[#fbf8f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8733e]'
                  ]"
                  class="flex min-h-16 min-w-16 flex-col items-center justify-center gap-0.5 rounded-xl border-2 px-4 py-2 font-semibold"
                  @click="seleccionarTalla(item)"
                >
                  <span>{{ item.talla?.nombre || 'Talla' }}</span>
                  <span v-if="getStock(item) === 0" class="text-[0.65rem] font-medium uppercase tracking-wide">
                    Agotada
                  </span>
                </button>
              </div>

              <p v-else class="text-sm text-gray-500">
                No hay tallas disponibles para este producto.
              </p>
            </fieldset>

            <div
              v-if="tallaActual && getStock(tallaActual) > 0"
              class="mb-7 flex flex-wrap items-end justify-between gap-4 rounded-2xl bg-[#f8f6f2] p-4"
            >
              <div>
                <label for="cantidad" class="mb-2 block text-sm font-semibold">
                  Cantidad
                </label>
                <select
                  id="cantidad"
                  v-model.number="cantidad"
                  class="min-h-11 w-24 rounded-xl border border-[#d9d2c8] bg-white px-3 py-2 focus:border-[#a8733e] focus:outline-none focus:ring-2 focus:ring-[#a8733e]/20"
                >
                  <option
                    v-for="opcion in opcionesCantidad"
                    :key="opcion"
                    :value="opcion"
                  >
                    {{ opcion }}
                  </option>
                </select>
              </div>
              <p class="pb-2 text-sm text-gray-500">
                {{ getStock(tallaActual) }} disponibles en talla {{ tallaActual.talla?.nombre || 'seleccionada' }}
              </p>
            </div>

            <p
              v-if="mensaje"
              role="status"
              aria-live="polite"
              class="mb-4 rounded-xl px-4 py-3 text-sm font-medium"
              :class="errorAgregar ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'"
            >
              {{ mensaje }}
            </p>

            <button
              type="button"
              class="mt-auto inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#292521] px-6 py-4 font-semibold text-white shadow-lg shadow-[#292521]/10 transition hover:bg-[#a8733e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8733e] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:shadow-none"
              :disabled="!tallaActual || getStock(tallaActual) === 0 || agregando"
              @click="agregarAlCarrito"
            >
              <i v-if="!agregando && tallaActual" class="pi pi-shopping-bag" aria-hidden="true"></i>
              {{ agregando ? 'Agregando...' : (productoAgotado ? 'Producto agotado' : (tallaActual ? 'Agregar al carrito' : 'Selecciona una talla')) }}
            </button>

            <button
              type="button"
              class="mt-3 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-[#a8733e] bg-white px-6 py-4 font-semibold text-[#8b6847] transition hover:bg-[#fbf8f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8733e] disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-500"
              :disabled="!tallaActual || getStock(tallaActual) === 0 || comprando"
              @click="comprarAhora"
            >
              <i v-if="!comprando" class="pi pi-bolt" aria-hidden="true"></i>
              {{ comprando ? 'Preparando compra...' : 'Comprar ahora' }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const producto = ref(null)
const cargando = ref(true)
const error = ref('')
const agregando = ref(false)
const comprando = ref(false)
const tallaSeleccionada = ref(null)
const mensaje = ref('')
const errorAgregar = ref(false)

const tallas = computed(() => producto.value?.tallas || [])

const getStock = (item) => {
  const stock = Number(item?.stock)
  return Number.isFinite(stock) ? Math.max(0, stock) : 0
}

const tallasDisponibles = computed(() =>
  tallas.value.filter((item) => getStock(item) > 0).length
)

const productoAgotado = computed(() =>
  tallas.value.length > 0 && tallasDisponibles.value === 0
)

const tallaActual = computed(() =>
  tallas.value.find(
    (item) => item.idProductoTalla === tallaSeleccionada.value
  )
)

const precioFinal = computed(() => {
  const precio = Number(producto.value?.precio)
  const descuento = Number(producto.value?.descuento) || 0

  if (!Number.isFinite(precio)) return 0
  return precio * (1 - descuento / 100)
})

const formatPrice = (price) => {
  const numero = Number(price)
  return Number.isFinite(numero) ? numero.toFixed(2) : '0.00'
}

const urlImagen = (imagen) => {
  if (!imagen) return 'https://via.placeholder.com/500x600?text=Shopware'
  if (imagen.startsWith('http')) return imagen
  return `http://localhost:3000${imagen}`
}

const cargarProducto = async () => {
  cargando.value = true
  producto.value = null
  tallaSeleccionada.value = null
  mensaje.value = ''
  error.value = ''

  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${route.params.id}`
    )
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'No se pudo cargar el producto')
    }

    producto.value = data
  } catch (err) {
    error.value = err.message
  } finally {
    cargando.value = false
  }
}

const cantidad = ref(1)

const opcionesCantidad = computed(() => {
  const stock = getStock(tallaActual.value)
  const maximo = Math.min(stock, 99)

  return Array.from({ length: maximo }, (_, indice) => indice + 1)
})

const seleccionarTalla = (item) => {
  if (getStock(item) <= 0) return

  tallaSeleccionada.value = item.idProductoTalla
  cantidad.value = 1
}

const agregarAlCarrito = async () => {
  if (!tallaActual.value || getStock(tallaActual.value) <= 0) {
    errorAgregar.value = true
    mensaje.value = 'Selecciona una talla disponible.'
    return
  }

  agregando.value = true
  mensaje.value = ''
  errorAgregar.value = false

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      sessionStorage.setItem('redirectAfterLogin', route.fullPath)
      await router.push('/login')
      return
    }

    const response = await fetch('http://localhost:3000/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        idProducto: producto.value.idProducto,
        idProductoTalla: tallaSeleccionada.value,
        cantidad: cantidad.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'No se pudo agregar al carrito')
    }

    mensaje.value = 'Producto agregado al carrito.'
  } catch (error) {
    errorAgregar.value = true
    mensaje.value = error.message
  } finally {
    agregando.value = false
  }
}

const comprarAhora = async () => {
  if (!tallaActual.value || getStock(tallaActual.value) <= 0) {
    errorAgregar.value = true
    mensaje.value = 'Selecciona una talla disponible.'
    return
  }

  comprando.value = true
  try {
    await router.push({
      name: 'Pago',
      query: {
        producto: String(producto.value.idProducto),
        talla: String(tallaSeleccionada.value),
        cantidad: String(cantidad.value)
      }
    })
  } finally {
    comprando.value = false
  }
}

const irACarrito = () => {
  router.push('/carrito')
}

watch(() => route.params.id, cargarProducto)
onMounted(cargarProducto)
</script>