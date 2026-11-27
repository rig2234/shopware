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

          <section class="mt-6 rounded-xl border border-gray-200 bg-[#fcfbf9] p-4">
            <h3 class="text-sm font-bold text-gray-900">Dirección de entrega</h3>

            <p v-if="cargandoDireccion" class="mt-3 text-sm text-gray-500" role="status">
              Cargando tu dirección...
            </p>

            <template v-else>
              <label for="direccion-pago" class="mt-3 block text-sm font-semibold text-gray-800">
                Dirección (obligatoria)
              </label>
              <textarea
                id="direccion-pago"
                ref="direccionInput"
                v-model="direccion"
                name="direccion"
                autocomplete="street-address"
                maxlength="100"
                rows="3"
                required
                placeholder="Calle, número, colonia y referencias"
                class="mt-2 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-[#c89456] focus:ring-2 focus:ring-[#d4a574]/30"
                :aria-invalid="direccionInvalida"
                @input="limpiarEstadoDireccion"
              ></textarea>
              <div class="mt-1 flex justify-between gap-3 text-xs text-gray-500">
                <span>Máximo 100 caracteres.</span>
                <span>{{ direccion.length }}/100</span>
              </div>

              <p v-if="!direccion.trim()" class="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800" role="status">
                No tienes una dirección registrada. Escríbela y guarda tu dirección antes de pagar.
              </p>
              <p v-if="errorDireccion" class="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {{ errorDireccion }}
              </p>
              <p v-if="mensajeDireccion" class="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700" role="status">
                {{ mensajeDireccion }}
              </p>

              <button
                type="button"
                class="mt-3 w-full rounded-lg border border-[#d4a574] px-4 py-2 text-sm font-bold text-[#292521] disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="guardandoDireccion"
                @click="guardarDireccion"
              >
                {{ guardandoDireccion ? 'Guardando...' : 'Guardar dirección' }}
              </button>

              <div class="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div class="p-3 pb-2">
                  <h4 class="text-sm font-semibold text-gray-900">Referencia en el mapa</h4>
                  <p class="mt-1 text-xs leading-5 text-gray-600">
                    Selecciona un punto para completar automáticamente la dirección.
                  </p>
                </div>
                <div
                  ref="contenedorMapa"
                  class="h-64 w-full bg-[#e8e5df]"
                  role="region"
                  aria-label="Mapa interactivo centrado en Culiacán, Sinaloa"
                  tabindex="0"
                ></div>
                <div class="p-3 pt-2">
                  <p v-if="coordenadasReferencia" class="text-xs text-gray-600" aria-live="polite">
                    Punto de referencia: {{ coordenadasReferencia.lat }}, {{ coordenadasReferencia.lng }}
                    <button
                      type="button"
                      class="ml-1 font-semibold text-[#8b5e34] underline underline-offset-2"
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
                    © OpenStreetMap contributors
                  </p>
                </div>
              </div>
            </template>
          </section>

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

          <p class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
            <span class="text-gray-600">Envío gratis</span>
            <span class="font-bold text-green-700">Gratis</span>
          </p>
        </aside>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { useRoute, useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const route = useRoute()

const API_URL = import.meta.env.VITE_API_URL
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
const direccion = ref('')
const direccionGuardada = ref('')
const direccionInput = ref(null)
const cargandoDireccion = ref(false)
const guardandoDireccion = ref(false)
const direccionInvalida = ref(false)
const errorDireccion = ref('')
const mensajeDireccion = ref('')
const contenedorMapa = ref(null)
const coordenadasReferencia = ref(null)
const errorMapa = ref('')
const buscandoDireccionMapa = ref(false)
const errorGeocodificacion = ref('')

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
let mapaDireccion = null
let marcadorDireccion = null
let temporizadorGeocodificacion = null
let controladorGeocodificacion = null
let solicitudGeocodificacion = 0
let ultimaSolicitudGeocodificacion = 0

const centroCuliacan = [24.8091, -107.394]

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

const limpiarEstadoDireccion = () => {
  direccionInvalida.value = false
  errorDireccion.value = ''
  mensajeDireccion.value = ''
}

const cargarDireccion = async (token) => {
  cargandoDireccion.value = true
  errorDireccion.value = ''

  try {
    const respuesta = await fetch(`${API_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.message || 'No se pudo cargar tu dirección')
    }

    direccion.value = datos.direccion || ''
    direccionGuardada.value = datos.direccion || ''
  } catch (errorCapturado) {
    errorDireccion.value =
      errorCapturado.message || 'No se pudo cargar tu dirección'
  } finally {
    cargandoDireccion.value = false
  }
}

const guardarDireccion = async () => {
  limpiarEstadoDireccion()

  if (!direccion.value.trim()) {
    direccionInvalida.value = true
    errorDireccion.value = 'Escribe una dirección válida.'
    direccionInput.value?.focus()
    return false
  }

  guardandoDireccion.value = true

  try {
    const token = localStorage.getItem('token')
    const respuesta = await fetch(`${API_URL}/api/auth/profile/address`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ direccion: direccion.value })
    })
    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.message || 'No se pudo guardar tu dirección')
    }

    direccion.value = datos.direccion
    direccionGuardada.value = datos.direccion
    mensajeDireccion.value = 'Dirección guardada correctamente.'
    return true
  } catch (errorCapturado) {
    direccionInvalida.value = true
    errorDireccion.value =
      errorCapturado.message || 'No se pudo guardar tu dirección'
    return false
  } finally {
    guardandoDireccion.value = false
  }
}

const cancelarGeocodificacion = () => {
  clearTimeout(temporizadorGeocodificacion)
  temporizadorGeocodificacion = null
  controladorGeocodificacion?.abort()
  controladorGeocodificacion = null
  solicitudGeocodificacion += 1
  buscandoDireccionMapa.value = false
}

const limpiarReferencia = () => {
  cancelarGeocodificacion()
  marcadorDireccion?.remove()
  marcadorDireccion = null
  coordenadasReferencia.value = null
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
    direccionFormateada = direccionFormateada
      ? `${direccionFormateada}, ${parte}`
      : parte
  }

  return direccionFormateada ||
    String(resultado.display_name || '').slice(0, 100)
}

const buscarDireccionDelPunto = ({ lat, lng }) => {
  clearTimeout(temporizadorGeocodificacion)
  controladorGeocodificacion?.abort()

  const idSolicitud = ++solicitudGeocodificacion
  const controlador = new AbortController()
  controladorGeocodificacion = controlador
  buscandoDireccionMapa.value = true
  errorGeocodificacion.value = ''

  const esperaMinima = Math.max(
    0,
    1000 - (Date.now() - ultimaSolicitudGeocodificacion)
  )

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
      const respuesta = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${parametros}`,
        { signal: controlador.signal }
      )

      if (!respuesta.ok) {
        throw new Error('No se pudo obtener la dirección del punto.')
      }

      const resultado = await respuesta.json()
      const direccionEncontrada = formatearDireccion(resultado)

      if (!direccionEncontrada) {
        throw new Error('No se encontró una dirección para este punto.')
      }
      if (idSolicitud !== solicitudGeocodificacion) return

      direccion.value = direccionEncontrada
      direccionInvalida.value = false
      errorDireccion.value = ''
      mensajeDireccion.value =
        'Dirección completada desde el punto seleccionado. Guarda los cambios.'
    } catch (errorCapturado) {
      if (
        errorCapturado.name === 'AbortError' ||
        idSolicitud !== solicitudGeocodificacion
      ) return

      errorGeocodificacion.value =
        errorCapturado.message || 'No se pudo obtener la dirección del punto.'
    } finally {
      if (idSolicitud === solicitudGeocodificacion) {
        controladorGeocodificacion = null
        buscandoDireccionMapa.value = false
      }
    }
  }, esperaMinima)
}

const inicializarMapaDireccion = async () => {
  await nextTick()

  if (!contenedorMapa.value) return
  if (mapaDireccion) {
    mapaDireccion.invalidateSize()
    return
  }

  try {
    mapaDireccion = L.map(contenedorMapa.value, {
      scrollWheelZoom: false
    }).setView(centroCuliacan, 13)

    const capa = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    )

    capa.on('tileerror', () => {
      errorMapa.value =
        'No se pudieron cargar algunas partes del mapa. Revisa tu conexión.'
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
  } catch (errorCapturado) {
    console.error('Error al inicializar el mapa:', errorCapturado)
    errorMapa.value = 'No se pudo inicializar el mapa.'
    mapaDireccion?.remove()
    mapaDireccion = null
  }
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

    await cargarDireccion(token)

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
    await inicializarMapaDireccion()

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

  if (!direccion.value.trim()) {
    direccionInvalida.value = true
    mensajeError.value =
      'No puedes continuar: registra una dirección de entrega antes de pagar.'
    await nextTick()
    direccionInput.value?.focus()
    return
  }

  if (direccion.value.trim() !== direccionGuardada.value.trim()) {
    const direccionGuardadaCorrectamente = await guardarDireccion()
    if (!direccionGuardadaCorrectamente) {
      mensajeError.value =
        'Guarda tu dirección de entrega antes de continuar con el pago.'
      return
    }
  }

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
  cancelarGeocodificacion()
  if (mapaDireccion) {
    mapaDireccion.remove()
    mapaDireccion = null
  }
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