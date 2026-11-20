<template>
  <main class="min-h-screen bg-[#f8f8f8] px-6 py-10 text-[#333]">
    <div class="mx-auto max-w-6xl">
      <div class="mb-8 flex items-center justify-between">
        <router-link to="/tienda" class="text-[#a8733e] hover:underline">
          ← Volver a la tienda
        </router-link>

        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 hover:border-[#d4a574]"
          @click="irACarrito"
        >
          Ver carrito
        </button>
      </div>

      <p v-if="cargando" class="rounded-xl bg-white p-8 text-gray-500">
        Cargando producto...
      </p>

      <p v-else-if="error" class="rounded-xl bg-white p-8 text-red-600">
        {{ error }}
      </p>

      <section
        v-else-if="producto"
        class="grid gap-8 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10"
      >
        <div class="overflow-hidden rounded-xl bg-gray-100">
          <img
            :src="urlImagen(producto.imagen)"
            :alt="producto.nombre || 'Producto Shopware'"
            class="h-full max-h-[600px] min-h-80 w-full object-cover"
          />
        </div>

        <div class="flex flex-col">
          <p class="mb-2 text-sm text-gray-500">
            {{ producto.categoria?.nombre || 'Producto Shopware' }}
          </p>

          <h1 class="mb-4 text-3xl font-bold text-[#1a1a1a]">
            {{ producto.nombre }}
          </h1>

          <div class="mb-8">
            <p class="text-3xl font-bold text-[#d4a574]">
              ${{ formatPrice(precioFinal) }}
            </p>
            <p
              v-if="Number(producto.descuento) > 0"
              class="text-gray-400 line-through"
            >
              ${{ formatPrice(producto.precio) }}
            </p>
          </div>

          <fieldset class="mb-6">
            <legend class="mb-3 font-semibold">Selecciona una talla</legend>

            <div v-if="tallas.length" class="flex flex-wrap gap-3">
              <button
                v-for="item in tallas"
                :key="item.idProductoTalla"
                type="button"
                :disabled="Number(item.stock) <= 0"
                :aria-pressed="tallaSeleccionada === item.idProductoTalla"
                :class="[
                  tallaSeleccionada === item.idProductoTalla
                    ? 'border-[#d4a574] bg-[#d4a574] text-white'
                    : 'border-gray-300 bg-white text-gray-800',
                  Number(item.stock) <= 0
                    ? 'cursor-not-allowed opacity-40'
                    : 'hover:border-[#d4a574]'
                ]"
                class="min-w-14 rounded-lg border-2 px-4 py-3 font-semibold"
                @click="seleccionarTalla(item)"
              >
                {{ item.talla?.nombre || 'Talla' }}
              </button>
            </div>

            <p v-else class="text-sm text-red-600">
              No hay tallas disponibles para este producto.
            </p>

            <p
              v-if="tallaActual && Number(tallaActual.stock) <= 0"
              class="mt-2 text-sm text-red-600"
            >
              Talla agotada.
            </p>
          </fieldset>

          <div v-if="tallaActual && Number(tallaActual.stock) > 0" class="mb-6">
  <label for="cantidad" class="mb-2 block font-semibold">
    Cantidad disponible: {{ tallaActual.stock }}
  </label>

  <select
    id="cantidad"
    v-model.number="cantidad"
    class="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-[#d4a574] focus:outline-none"
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

          <p v-if="mensaje" class="mb-4 text-sm" :class="errorAgregar ? 'text-red-600' : 'text-green-700'">
            {{ mensaje }}
          </p>

          <button
            type="button"
            class="mt-auto rounded-lg bg-[#1a1a1a] px-6 py-3 font-bold text-white transition-colors hover:bg-[#d4a574] hover:text-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!tallaSeleccionada || Number(tallaActual?.stock) <= 0 || agregando"
            @click="agregarAlCarrito"
          >
            {{ agregando ? 'Agregando...' : 'Agregar al carrito' }}
          </button>
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
const agregando = ref(false)
const tallaSeleccionada = ref(null)
const mensaje = ref('')
const errorAgregar = ref(false)

const tallas = computed(() => producto.value?.tallas || [])

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

  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${route.params.id}`
    )
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'No se pudo cargar el producto')
    }

    producto.value = data
  } catch (error) {
    mensaje.value = error.message
  } finally {
    cargando.value = false
  }
}

const cantidad = ref(1)

const opcionesCantidad = computed(() => {
  const stock = Number(tallaActual.value?.stock || 0)
  const maximo = Math.min(stock, 99)

  return Array.from({ length: maximo }, (_, indice) => indice + 1)
})

const seleccionarTalla = (item) => {
  tallaSeleccionada.value = item.idProductoTalla
  cantidad.value = 1
}

const agregarAlCarrito = async () => {
  if (!tallaSeleccionada.value) {
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

const irACarrito = () => {
  router.push('/carrito')
}

watch(() => route.params.id, cargarProducto)
onMounted(cargarProducto)
</script>