<template>
  <main class="min-h-screen bg-[#f8f8f8] px-6 py-10 text-[#333]">
    <div class="mx-auto max-w-4xl">
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl font-bold">Mi carrito</h1>
        <router-link to="/tienda" class="text-[#a8733e] hover:underline">
          Seguir comprando
        </router-link>
      </div>

      <p v-if="cargando" class="rounded-lg bg-white p-6 text-gray-500">
        Cargando carrito...
      </p>

      <p v-else-if="error" class="rounded-lg bg-white p-6 text-red-600">
        {{ error }}
      </p>

      <section v-else-if="items.length" class="space-y-4">
        <article
          v-for="item in items"
          :key="item.idCarrito"
          class="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center"
        >
          <img
            :src="urlImagen(item.producto?.imagen)"
            :alt="item.producto?.nombre || 'Producto'"
            class="h-28 w-24 rounded-lg bg-gray-100 object-cover"
          />

          <div class="flex-1">
            <h2 class="text-lg font-bold">
              {{ item.producto?.nombre || 'Producto no disponible' }}
            </h2>
            <p class="text-sm text-gray-500">
              Cantidad: {{ item.cantidad }}
            </p>
            <p class="mt-1 font-semibold text-[#a8733e]">
              ${{ formatPrice(item.subtotal) }}
            </p>
          </div>

          <button
            type="button"
            class="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            :disabled="eliminando === item.idCarrito"
            @click="eliminarItem(item.idCarrito)"
          >
            {{ eliminando === item.idCarrito ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </article>

        <div class="rounded-xl bg-white p-5 text-right shadow-sm">
          <p class="text-lg font-bold">
            Total: ${{ formatPrice(total) }}
          </p>
          <button
            type="button"
            class="mt-4 rounded-lg bg-[#d4a574] px-6 py-3 font-bold text-white hover:bg-[#c89456]"
            @click="alertaCompra"
          >
            Continuar con la compra
          </button>
        </div>
      </section>

      <div v-else class="rounded-xl bg-white py-16 text-center shadow-sm">
        <p class="mb-4 text-xl text-gray-600">Tu carrito está vacío.</p>
        <router-link
          to="/tienda"
          class="rounded-lg bg-[#d4a574] px-5 py-3 font-semibold text-white hover:bg-[#c89456]"
        >
          Explorar productos
        </router-link>
      </div>
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

const formatPrice = (price) => {
  const numero = Number(price)
  return Number.isFinite(numero) ? numero.toFixed(2) : '0.00'
}

const urlImagen = (imagen) => {
  if (!imagen) return 'https://via.placeholder.com/200x250?text=Shopware'
  if (imagen.startsWith('http')) return imagen
  return `http://localhost:3000${imagen}`
}

const cargarCarrito = async () => {
  cargando.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
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
    error.value = err.message
  } finally {
    cargando.value = false
  }
}

const eliminarItem = async (idCarrito) => {
  eliminando.value = idCarrito

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
    error.value = err.message
  } finally {
    eliminando.value = null
  }
}

const alertaCompra = () => {
  alert('El siguiente paso es implementar la creación del pedido y el pago.')
}

onMounted(cargarCarrito)
</script>