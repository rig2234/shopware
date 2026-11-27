<template>
  <main class="min-h-screen bg-[#f7f5f2] px-4 py-8 text-[#292521] sm:px-6 lg:py-12">
    <div class="mx-auto max-w-4xl">
      <header class="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#a8733e]">
            Shopware
          </p>
          <h1 class="text-3xl font-bold sm:text-4xl">Pago seguro</h1>
          <p class="mt-2 text-sm text-gray-500">
            Completa el pago de prueba con Stripe.
          </p>
        </div>

        <router-link
          :to="compraDirecta ? `/producto/${route.query.producto}` : '/carrito'"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:border-[#d4a574]"
        >
          {{ compraDirecta ? '← Volver al producto' : '← Volver al carrito' }}
        </router-link>
      </header>

      <section
        v-if="cargando"
        class="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm"
      >
        Preparando el pago...
      </section>

      <section
        v-else-if="error"
        class="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm"
      >
        <p class="font-semibold text-red-700">{{ error }}</p>
        <button
          type="button"
          class="mt-4 rounded-lg bg-[#292521] px-5 py-2 text-sm font-semibold text-white"
          @click="cargarPago"
        >
          Intentar de nuevo
        </button>
      </section>

      <section
        v-else-if="pagoCompletado"
        class="rounded-2xl border border-green-200 bg-white p-10 text-center shadow-sm"
      >
        <div
          class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700"
        >
          ✓
        </div>
        <h2 class="text-2xl font-bold">¡Pago completado!</h2>
        <p v-if="idPedido" class="mt-2 text-gray-500">
          Número de pedido: {{ idPedido }}
        </p>

        <section
          v-if="estadoPedido"
          class="mx-auto mt-8 max-w-xl rounded-2xl border border-[#eee7de] bg-[#fbf9f6] p-5 text-left sm:p-6"
          aria-live="polite"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h3 class="font-bold">Seguimiento del envío</h3>
            <span class="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#8b6847]">
              {{ textoEstadoEnvio }}
            </span>
          </div>

          <div v-if="!['CANCELADO', 'CANCELACION_PENDIENTE'].includes(estadoPedido)" class="mt-6">
            <div class="h-2 overflow-hidden rounded-full bg-[#e8e1d8]">
              <div
                class="h-full rounded-full bg-[#a8733e] transition-[width] duration-700"
                :style="{ width: `${progresoEnvio}%` }"
              ></div>
            </div>
            <ol class="mt-3 grid grid-cols-3 text-center text-xs font-medium sm:text-sm">
              <li
                v-for="(etapa, indice) in etapasEnvio"
                :key="etapa"
                class="flex flex-col items-center gap-2"
                :class="indice + 1 <= pasoEnvio ? 'text-[#8b6847]' : 'text-gray-400'"
              >
                <span
                  class="grid h-7 w-7 place-items-center rounded-full border-2 bg-white"
                  :class="indice + 1 <= pasoEnvio ? 'border-[#a8733e] text-[#a8733e]' : 'border-gray-300'"
                  aria-hidden="true"
                >
                  {{ indice + 1 < pasoEnvio ? '✓' : indice + 1 }}
                </span>
                {{ etapa }}
              </li>
            </ol>
          </div>

          <p class="mt-5 text-sm text-gray-600">
            {{ descripcionEstadoEnvio }}
          </p>
          <p v-if="['PREPARACION', 'EN_CAMINO'].includes(estadoPedido)" class="mt-2 text-xs text-gray-500">
            En esta simulación, el pedido se entregará aproximadamente un minuto después de confirmar el pago.
          </p>
          <button
            v-if="['PREPARACION', 'EN_CAMINO', 'CANCELACION_PENDIENTE'].includes(estadoPedido)"
            type="button"
            class="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-60"
            :disabled="cancelandoPedido"
            @click="cancelarPedido"
          >
            {{ cancelandoPedido ? 'Cancelando pedido...' : 'Cancelar pedido' }}
          </button>
        </section>

        <button
          v-if="idPedido"
          type="button"
          class="mt-6 inline-flex rounded-xl border border-[#292521] px-6 py-3 font-bold text-[#292521]"
          @click="descargarFactura"
        >
          Descargar factura PDF
        </button>

        <router-link
          to="/tienda"
          class="mt-4 inline-flex rounded-xl bg-[#292521] px-6 py-3 font-semibold text-white"
        >
          Volver a la tienda
        </router-link>
      </section>

      <section
        v-else-if="carritoVacio"
        class="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm"
      >
        <h2 class="text-2xl font-bold">Tu carrito está vacío</h2>

        <router-link
          to="/tienda"
          class="mt-6 inline-flex rounded-xl bg-[#292521] px-6 py-3 font-semibold text-white"
        >
          Explorar productos
        </router-link>
      </section>

      <section
        v-else
        class="grid items-start gap-6 md:grid-cols-[1fr_330px]"
      >
        <form
          class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          @submit.prevent="pagar"
        >
          <h2 class="text-xl font-bold">Datos de pago</h2>
          <p class="mt-2 text-sm text-gray-500">
            Usa una tarjeta de prueba de Stripe. No se realizará un cargo real.
          </p>

          <label
            for="stripe-card"
            class="mb-2 mt-6 block text-sm font-semibold"
          >
            Tarjeta
          </label>

          <div
            id="stripe-card"
            class="min-h-12 rounded-lg border border-gray-300 bg-white p-4"
          ></div>

          <p v-if="errorTarjeta" class="mt-2 text-sm text-red-600">
            {{ errorTarjeta }}
          </p>

          <p v-if="mensajeError" class="mt-4 text-sm text-red-600">
            {{ mensajeError }}
          </p>

          <button
            type="submit"
            class="mt-6 w-full rounded-xl bg-[#292521] px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="procesando || !stripe || confirmarPendiente"
            v-if="false"
          >
            Pagar
          </button>

          <button
            type="submit"
            class="mt-6 w-full rounded-xl bg-[#292521] px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="procesando || !stripe"
          >
            {{ procesando ? 'Procesando...' : `Pagar ${formatearPrecio(total)}` }}
          </button>

          <p class="mt-3 text-center text-xs text-gray-500">
            Tarjeta de prueba:
            <strong>4242 4242 4242 4242</strong>
          </p>
        </form>

        <aside class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-bold">Resumen del pedido</h2>

          <ul class="mt-4 divide-y divide-gray-100">
            <li
              v-for="item in items"
              :key="item.idCarrito || item.idProductoTalla"
              class="flex justify-between gap-4 py-3 text-sm"
            >
              <span class="text-gray-600">
                {{ item.producto?.nombre || 'Producto' }}
                <span class="text-gray-400">× {{ item.cantidad }}</span>
              </span>

              <span class="shrink-0 font-semibold">
                {{ formatearPrecio(item.subtotal) }}
              </span>
            </li>
          </ul>

          <div class="mt-4 flex justify-between border-t border-gray-100 pt-4 text-lg font-bold">
            <span>Total</span>
            <span class="text-[#a8733e]">
              {{ formatearPrecio(total) }}
            </span>
          </div>
        </aside>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

const cargando = ref(true)
const procesando = ref(false)
const error = ref('')
const mensajeError = ref('')
const errorTarjeta = ref('')
const carritoVacio = ref(false)
const pagoCompletado = ref(false)
const confirmarPendiente = ref(false)
const cancelandoPedido = ref(false)

const items = ref([])
const total = ref(0)
const idPedido = ref('')
const estadoPedido = ref('')
const paymentIntentId = ref('')
const clientSecret = ref('')

const compraDirecta = Boolean(
  route.query.producto || route.query.talla || route.query.cantidad
)

let stripe = null
let elementoTarjeta = null
let intervaloSeguimiento = null

const etapasEnvio = ['Preparando', 'En camino', 'Entregado']

const pasoEnvio = computed(() =>
  ({ PREPARACION: 1, EN_CAMINO: 2, ENTREGADO: 3 })[estadoPedido.value] || 0
)

const progresoEnvio = computed(() =>
  ({ PREPARACION: 15, EN_CAMINO: 65, ENTREGADO: 100 })[estadoPedido.value] || 0
)

const textoEstadoEnvio = computed(() => ({
  PREPARACION: 'Pedido en preparación',
  EN_CAMINO: 'Pedido en camino',
  ENTREGADO: 'Pedido entregado',
  CANCELACION_PENDIENTE: 'Cancelación en proceso',
  CANCELADO: 'Pedido cancelado'
})[estadoPedido.value] || 'Estado no disponible')

const descripcionEstadoEnvio = computed(() => {
  if (estadoPedido.value === 'CANCELADO') return 'El pedido fue cancelado y se solicitó el reembolso.'
  if (estadoPedido.value === 'CANCELACION_PENDIENTE') return 'Estamos procesando la cancelación y el reembolso.'
  if (estadoPedido.value === 'PREPARACION') return 'Estamos preparando tu pedido.'
  if (estadoPedido.value === 'EN_CAMINO') return 'Tu pedido va en camino.'
  return 'Tu pedido ha llegado.'
})

const formatearPrecio = (valor) => {
  const numero = Number(valor)

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(Number.isFinite(numero) ? numero : 0)
}

const cargarPago = async () => {
  cargando.value = true
  error.value = ''
  mensajeError.value = ''
  errorTarjeta.value = ''
  carritoVacio.value = false
  pagoCompletado.value = false

  if (elementoTarjeta) {
    elementoTarjeta.destroy()
    elementoTarjeta = null
  }

  try {
    const token = localStorage.getItem('token')

    if (!token) {
      sessionStorage.setItem('redirectAfterLogin', '/pago')
      await router.push('/login')
      return
    }

    if (!STRIPE_PUBLIC_KEY) {
      throw new Error(
        'Falta configurar VITE_STRIPE_PUBLISHABLE_KEY en frontend/.env'
      )
    }

    stripe = await loadStripe(STRIPE_PUBLIC_KEY)

    if (!stripe) {
      throw new Error('No se pudo inicializar Stripe')
    }

    let datosCompraDirecta = null

    if (compraDirecta) {
      const idProducto = Number(route.query.producto)
      const idProductoTalla = Number(route.query.talla)
      const cantidad = Number(route.query.cantidad)

      if (
        !Number.isInteger(idProducto) || idProducto <= 0 ||
        !Number.isInteger(idProductoTalla) || idProductoTalla <= 0 ||
        !Number.isInteger(cantidad) || cantidad <= 0
      ) {
        throw new Error('Los datos de la compra no son válidos')
      }

      const respuestaProducto = await fetch(
        `${API_URL}/api/products/${idProducto}`
      )
      const producto = await respuestaProducto.json()

      if (!respuestaProducto.ok) {
        throw new Error(producto.error || 'No se pudo cargar el producto')
      }

      const productoTalla = producto.tallas?.find(
        (item) => Number(item.idProductoTalla) === idProductoTalla
      )

      if (!productoTalla || Number(productoTalla.stock || 0) < cantidad) {
        throw new Error('No hay stock suficiente para la talla seleccionada')
      }

      const precio = Number(producto.precio)
      const descuento = Number(producto.descuento) || 0
      const precioUnitario = precio * (1 - descuento / 100)

      items.value = [{
        idProductoTalla,
        producto,
        cantidad,
        subtotal: precioUnitario * cantidad
      }]
      datosCompraDirecta = { idProducto, idProductoTalla, cantidad }
    } else {
      const respuestaCarrito = await fetch(`${API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const carrito = await respuestaCarrito.json()

      if (!respuestaCarrito.ok) {
        throw new Error(carrito.message || 'No se pudo cargar el carrito')
      }

      items.value = Array.isArray(carrito) ? carrito : []

      if (!items.value.length) {
        carritoVacio.value = true
        cargando.value = false
        return
      }
    }

    const respuestaIntent = await fetch(
      `${API_URL}/api/payments/create-intent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datosCompraDirecta || {})
      }
    )

    const datosIntent = await respuestaIntent.json()

    if (!respuestaIntent.ok) {
      throw new Error(
        datosIntent.message || 'No se pudo iniciar el pago'
      )
    }

    paymentIntentId.value = datosIntent.paymentIntentId
    clientSecret.value = datosIntent.clientSecret
    total.value = Number(datosIntent.total)

    if (!paymentIntentId.value || !clientSecret.value) {
      throw new Error(
        'El servidor no devolvió los datos necesarios para Stripe'
      )
    }

    cargando.value = false
    await nextTick()

    const contenedorTarjeta = document.querySelector('#stripe-card')

    if (!contenedorTarjeta) {
      throw new Error(
        'No se encontró el contenedor de la tarjeta en el formulario'
      )
    }

    const elementos = stripe.elements()

    elementoTarjeta = elementos.create('card', {
      style: {
        base: {
          color: '#292521',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          '::placeholder': {
            color: '#9ca3af'
          }
        },
        invalid: {
          color: '#dc2626'
        }
      }
    })

    elementoTarjeta.mount(contenedorTarjeta)

    elementoTarjeta.on('change', (evento) => {
      errorTarjeta.value = evento.error?.message || ''
    })
  } catch (errorCapturado) {
    error.value =
      errorCapturado.message || 'No se pudo preparar el pago'
  } finally {
    cargando.value = false
  }
}

const obtenerSeguimientoPedido = async (id) => {
  const token = localStorage.getItem('token')
  const respuesta = await fetch(`${API_URL}/api/payments/orders/${id}/tracking`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const pedido = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(pedido.message || 'No se pudo cargar el seguimiento')
  }
  estadoPedido.value = pedido.estado
}

const cargarSeguimiento = async (id) => {
  cargando.value = true
  error.value = ''
  pagoCompletado.value = false

  if (intervaloSeguimiento) {
    clearInterval(intervaloSeguimiento)
    intervaloSeguimiento = null
  }

  try {
    await obtenerSeguimientoPedido(id)
    idPedido.value = id
    pagoCompletado.value = true
    intervaloSeguimiento = setInterval(async () => {
      try {
        await obtenerSeguimientoPedido(id)
        if (['ENTREGADO', 'CANCELADO'].includes(estadoPedido.value)) {
          clearInterval(intervaloSeguimiento)
          intervaloSeguimiento = null
        }
      } catch (errorCapturado) {
        console.error('Error actualizando el seguimiento:', errorCapturado)
      }
    }, 1000)
  } catch (errorCapturado) {
    error.value = errorCapturado.message || 'No se pudo cargar el seguimiento'
  } finally {
    cargando.value = false
  }
}

const cancelarPedido = async () => {
  if (!window.confirm(`¿Deseas cancelar el pedido #${idPedido.value}? Se solicitará el reembolso.`)) {
    return
  }

  cancelandoPedido.value = true
  mensajeError.value = ''

  try {
    const respuesta = await fetch(
      `${API_URL}/api/payments/orders/${idPedido.value}/cancel`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    )
    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.message || 'No se pudo cancelar el pedido')
    }

    estadoPedido.value = 'CANCELADO'
  } catch (errorCapturado) {
    mensajeError.value = errorCapturado.message || 'No se pudo cancelar el pedido'
  } finally {
    cancelandoPedido.value = false
  }
}

const cargarVista = () => {
  if (route.query.pedido) {
    return cargarSeguimiento(route.query.pedido)
  }
  return cargarPago()
}

const confirmarPedido = async () => {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(`${API_URL}/api/payments/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      paymentIntentId: paymentIntentId.value
    })
  })

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        'Stripe confirmó el pago, pero no se pudo registrar el pedido'
    )
  }

  idPedido.value = datos.idPedido
  confirmarPendiente.value = false
  await router.replace({ query: { pedido: String(datos.idPedido) } })
  await cargarSeguimiento(datos.idPedido)
}

const descargarFactura = async () => {
  const token = localStorage.getItem('token')
  const respuesta = await fetch(
    `${API_URL}/api/payments/invoice/${idPedido.value}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )

  if (!respuesta.ok) {
    mensajeError.value = 'No se pudo descargar la factura'
    return
  }

  const blob = await respuesta.blob()
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = `factura-${String(idPedido.value).padStart(6, '0')}.pdf`
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
  URL.revokeObjectURL(url)
}

const pagar = async () => {
  if (procesando.value) return

  procesando.value = true
  mensajeError.value = ''

  try {
    if (confirmarPendiente.value) {
      await confirmarPedido()
      return
    }

    const resultado = await stripe.confirmCardPayment(
      clientSecret.value,
      {
        payment_method: {
          card: elementoTarjeta
        }
      }
    )

    if (resultado.error) {
      throw new Error(
        resultado.error.message || 'No se pudo procesar la tarjeta'
      )
    }

    if (resultado.paymentIntent?.status !== 'succeeded') {
      throw new Error(
        `El pago no se completó. Estado: ${
          resultado.paymentIntent?.status || 'desconocido'
        }`
      )
    }

    confirmarPendiente.value = true
    await confirmarPedido()
  } catch (errorCapturado) {
    mensajeError.value =
      errorCapturado.message || 'No se pudo completar el pago'
  } finally {
    procesando.value = false
  }
}

onMounted(cargarVista)

onBeforeUnmount(() => {
  if (intervaloSeguimiento) {
    clearInterval(intervaloSeguimiento)
    intervaloSeguimiento = null
  }
  if (elementoTarjeta) {
    elementoTarjeta.destroy()
    elementoTarjeta = null
  }
})
</script>