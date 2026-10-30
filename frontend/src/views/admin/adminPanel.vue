<template>
  <div class="min-h-screen bg-slate-950 text-white flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900/90 border-r border-slate-800 fixed h-screen flex flex-col backdrop-blur-sm shadow-2xl shadow-slate-950/40">
      <div class="p-5 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <i class="pi pi-shield text-slate-950 text-lg"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-amber-500 tracking-tight">Admin Panel</h1>
            <p class="text-xs text-slate-400">{{ usuario?.nombre || 'Administrador' }}</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <button
          @click="seccionActiva = 'dashboard'"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left',
            seccionActiva === 'dashboard'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <i class="pi pi-home text-base"></i>
          <span class="font-medium">Dashboard</span>
        </button>

        <button
          @click="seccionActiva = 'productos'"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left',
            seccionActiva === 'productos'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <i class="pi pi-box text-base"></i>
          <span class="font-medium">Productos</span>
        </button>

        <button
          @click="seccionActiva = 'usuarios'"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left',
            seccionActiva === 'usuarios'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <i class="pi pi-users text-base"></i>
          <span class="font-medium">Usuarios</span>
        </button>

        <button
          @click="seccionActiva = 'pedidos'"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left',
            seccionActiva === 'pedidos'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <i class="pi pi-shopping-cart text-base"></i>
          <span class="font-medium">Pedidos</span>
        </button>

        <button
          @click="seccionActiva = 'categorias'"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left',
            seccionActiva === 'categorias'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <i class="pi pi-tags text-base"></i>
          <span class="font-medium">Categorías</span>
        </button>
      </nav>

      <div class="p-4 border-t border-slate-800">
        <button
          @click="cerrarSesion"
          class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-all shadow-lg shadow-red-600/20"
        >
          <i class="pi pi-sign-out text-base"></i>
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="ml-64 flex-1 overflow-auto">
      <div class="p-8">
        <!-- Dashboard -->
        <div v-if="seccionActiva === 'dashboard'">
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p class="text-slate-400">Bienvenido al panel de administración</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <Card class="bg-slate-800 border-slate-700">
              <template #title>
                <span class="text-slate-300">Total Productos</span>
              </template>
              <template #content>
                <div class="flex items-center justify-between">
                  <p class="text-3xl font-bold text-white">{{ stats.productos }}</p>
                  <div class="bg-blue-500/20 p-3 rounded-lg text-blue-400">
                    <i class="pi pi-box text-2xl"></i>
                  </div>
                </div>
              </template>
            </Card>

            <Card class="bg-slate-800 border-slate-700">
              <template #title>
                <span class="text-slate-300">Total Usuarios</span>
              </template>
              <template #content>
                <div class="flex items-center justify-between">
                  <p class="text-3xl font-bold text-white">{{ stats.usuarios }}</p>
                  <div class="bg-green-500/20 p-3 rounded-lg text-green-400">
                    <i class="pi pi-users text-2xl"></i>
                  </div>
                </div>
              </template>
            </Card>

            <Card class="bg-slate-800 border-slate-700">
              <template #title>
                <span class="text-slate-300">Total Pedidos</span>
              </template>
              <template #content>
                <div class="flex items-center justify-between">
                  <p class="text-3xl font-bold text-white">{{ stats.pedidos }}</p>
                  <div class="bg-purple-500/20 p-3 rounded-lg text-purple-400">
                    <i class="pi pi-shopping-cart text-2xl"></i>
                  </div>
                </div>
              </template>
            </Card>

            <Card class="bg-slate-800 border-slate-700">
              <template #title>
                <span class="text-slate-300">Ventas Totales</span>
              </template>
              <template #content>
                <div class="flex items-center justify-between">
                  <p class="text-3xl font-bold text-white">${{ formatPrice(stats.ventas) }}</p>
                  <div class="bg-amber-500/20 p-3 rounded-lg text-amber-400">
                    <i class="pi pi-dollar text-2xl"></i>
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <div
            v-if="stats.bajo_stock > 0"
            class="bg-amber-950 border-l-4 border-amber-500 p-4 rounded mb-8 flex items-center gap-3"
          >
            <i class="pi pi-exclamation-triangle text-amber-500 text-lg"></i>
            <span class="text-amber-100">
              Hay <strong>{{ stats.bajo_stock }}</strong> producto(s) con bajo stock.
              <a href="#" @click.prevent="seccionActiva = 'productos'" class="underline hover:no-underline">
                Ver productos
              </a>
            </span>
          </div>

          <Card class="bg-slate-800 border-slate-700 overflow-hidden">
            <template #title>
              <span class="text-white">Pedidos Recientes</span>
            </template>

            <template #content>
              <DataTable :value="pedidosRecientes" tableStyle="min-width: 100%" paginator :rows="10" responsiveLayout="scroll">
                <Column field="idPedido" header="ID Pedido">
                  <template #body="slotProps">
                    <span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                      #{{ slotProps.data.idPedido }}
                    </span>
                  </template>
                </Column>

                <Column field="usuario" header="Cliente">
                  <template #body="slotProps">
                    {{ slotProps.data.usuario?.nombre || 'N/A' }}
                  </template>
                </Column>

                <Column field="fechaPedido" header="Fecha">
                  <template #body="slotProps">
                    {{ formatDate(slotProps.data.fechaPedido) }}
                  </template>
                </Column>

                <Column field="total" header="Total">
                  <template #body="slotProps">
                    <span class="text-green-400 font-semibold">
                      ${{ formatPrice(slotProps.data.total) }}
                    </span>
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </div>

        <!-- Productos -->
        <div v-if="seccionActiva === 'productos'">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">Productos</h1>
              <p class="text-slate-400">Gestiona el catálogo de productos</p>
            </div>

            <Button
              label="Nuevo Producto"
              icon="pi pi-plus"
              severity="primary"
              @click="mostrarFormNuevoProducto = !mostrarFormNuevoProducto"
            />
          </div>

          <!-- Formulario -->
          <Card v-if="mostrarFormNuevoProducto" class="mb-8">
            <template #title>
              <span class="text-white">Crear Nuevo Producto</span>
            </template>

            <template #content>
              <form @submit.prevent="crearProducto" class="space-y-6" enctype="multipart/form-data">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div class="flex flex-col gap-2">
                    <label class="text-slate-300">Nombre</label>
                    <InputText v-model="nuevoProducto.nombre" placeholder="Ej: Camiseta Azul" />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-slate-300">Precio</label>
                    <InputNumber
                      v-model="nuevoProducto.precio"
                      mode="decimal"
                      :minFractionDigits="2"
                      :maxFractionDigits="2"
                      placeholder="0.00"
                    />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-slate-300">Categoría</label>
                    <Dropdown
                      v-model="nuevoProducto.categoriaId"
                      :options="categorias"
                      optionLabel="nombreCompleto"
                      optionValue="idCategoria"
                      placeholder="Selecciona..."
                    />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-slate-300">Imagen</label>
                    <FileUpload
                      mode="basic"
                      accept="image/*"
                      :auto="true"
                      :maxFileSize="10000000"
                      @select="onFileChange"
                    />
                    <div v-if="imagePreview" class="mt-2">
                      <img :src="imagePreview" alt="Preview" class="w-24 h-24 object-cover rounded" />
                    </div>
                  </div>
                </div>

                <div class="flex gap-3 justify-end pt-4 border-t border-slate-700">
                  <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    @click="mostrarFormNuevoProducto = false"
                  />
                  <Button type="submit" label="Crear Producto" severity="success" />
                </div>
              </form>
            </template>
          </Card>

          <!-- Tabla -->
          <Card>
            <template #content>
              <DataTable
                :value="productos"
                tableStyle="min-width: 100%"
                paginator
                :rows="10"
                :rowsPerPageOptions="[10, 20, 30]"
                responsiveLayout="scroll"
              >
                <Column field="idProducto" header="ID">
                  <template #body="slotProps">
                    <span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                      #{{ slotProps.data.idProducto }}
                    </span>
                  </template>
                </Column>

                <Column field="nombre" header="Nombre">
                  <template #body="slotProps">
                    <div class="flex items-center gap-3">
                      <img
                        v-if="slotProps.data.imagen"
                        :src="getImageUrl(slotProps.data.imagen)"
                        alt=""
                        class="w-12 h-12 object-cover rounded"
                      />
                      <span>{{ slotProps.data.nombre }}</span>
                    </div>
                  </template>
                </Column>

                <Column field="precio" header="Precio">
                  <template #body="slotProps">
                    <span class="text-green-400 font-semibold">
                      ${{ formatPrice(slotProps.data.precio) }}
                    </span>
                  </template>
                </Column>

                <Column field="categoria" header="Categoría">
                  <template #body="slotProps">
                    {{ slotProps.data.categoria?.nombre || 'N/A' }}
                  </template>
                </Column>

                <Column header="Acciones">
                  <template #body="slotProps">
                    <div class="flex gap-2">
                      <Button label="Editar" severity="warning" size="small" />
                      <Button
                        label="Eliminar"
                        severity="danger"
                        size="small"
                        @click="eliminarProductoConfirm(slotProps.data)"
                      />
                    </div>
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </div>

        <!-- Usuarios -->
        <div v-if="seccionActiva === 'usuarios'">
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-white mb-2">Usuarios</h1>
            <p class="text-slate-400">Gestiona los usuarios registrados</p>
          </div>

          <Card>
            <template #content>
              <DataTable :value="usuarios" tableStyle="min-width: 100%" paginator :rows="10" responsiveLayout="scroll">
                <Column field="idUsuario" header="ID">
                  <template #body="slotProps">
                    <span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                      #{{ slotProps.data.idUsuario }}
                    </span>
                  </template>
                </Column>

                <Column field="nombre" header="Nombre" />
                <Column field="correo" header="Correo" />
                <Column field="rol" header="Rol">
                  <template #body="slotProps">
                    {{ slotProps.data.rol?.nombreRol || 'N/A' }}
                  </template>
                </Column>

                <Column field="estatus" header="Estado">
                  <template #body="slotProps">
                    <Tag
                      :value="slotProps.data.estatus"
                      :severity="slotProps.data.estatus === 'activo' ? 'success' : 'danger'"
                    />
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </div>

        <!-- Pedidos -->
        <div v-if="seccionActiva === 'pedidos'">
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-white mb-2">Pedidos</h1>
            <p class="text-slate-400">Historial de pedidos realizados</p>
          </div>

          <Card>
            <template #content>
              <DataTable :value="pedidos" tableStyle="min-width: 100%" paginator :rows="10" responsiveLayout="scroll">
                <Column field="idPedido" header="ID Pedido">
                  <template #body="slotProps">
                    <span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                      #{{ slotProps.data.idPedido }}
                    </span>
                  </template>
                </Column>

                <Column field="usuario" header="Cliente">
                  <template #body="slotProps">
                    {{ slotProps.data.usuario?.nombre || 'N/A' }}
                  </template>
                </Column>

                <Column field="fechaPedido" header="Fecha">
                  <template #body="slotProps">
                    {{ formatDate(slotProps.data.fechaPedido) }}
                  </template>
                </Column>

                <Column field="total" header="Total">
                  <template #body="slotProps">
                    <span class="text-green-400 font-semibold">
                      ${{ formatPrice(slotProps.data.total) }}
                    </span>
                  </template>
                </Column>

                <Column field="detalles" header="Artículos">
                  <template #body="slotProps">
                    {{ slotProps.data.detalles?.length || 0 }}
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </div>

        <!-- Categorías -->
        <div v-if="seccionActiva === 'categorias'">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">Categorías</h1>
              <p class="text-slate-400">Gestiona las categorías de productos</p>
            </div>

            <Button
              label="Nueva Categoría"
              icon="pi pi-plus"
              severity="primary"
              @click="mostrarFormNuevaCategoria = !mostrarFormNuevaCategoria"
            />
          </div>

          <!-- Formulario -->
          <Card v-if="mostrarFormNuevaCategoria" class="mb-8">
            <template #title>
              <span class="text-white">Crear Nueva Categoría</span>
            </template>

            <template #content>
              <form @submit.prevent="crearCategoria" class="space-y-6">
                <div>
                  <label class="text-slate-300 block mb-2">Nombre</label>
                  <InputText v-model="nuevaCategoria.nombre" placeholder="Ej: Camisetas" />
                </div>

                <div class="flex gap-3 justify-end pt-4 border-t border-slate-700">
                  <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    @click="mostrarFormNuevaCategoria = false"
                  />
                  <Button type="submit" label="Crear Categoría" severity="success" />
                </div>
              </form>
            </template>
          </Card>

          <!-- Tabla -->
          <Card>
            <template #content>
              <DataTable :value="categorias" tableStyle="min-width: 100%" paginator :rows="10" responsiveLayout="scroll">
                <Column field="idCategoria" header="ID">
                  <template #body="slotProps">
                    <span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                      #{{ slotProps.data.idCategoria }}
                    </span>
                  </template>
                </Column>

                <Column field="nombre" header="Nombre" />
                <Column field="productos" header="Productos">
                  <template #body="slotProps">
                    {{ slotProps.data.productos?.length || 0 }}
                  </template>
                </Column>

                <Column header="Acciones">
                  <template #body="slotProps">
                    <Button
                      label="Eliminar"
                      severity="danger"
                      size="small"
                      @click="eliminarCategoriaConfirm(slotProps.data)"
                    />
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </div>
      </div>
    </main>

    <!-- Modal de Confirmación -->
    <Dialog v-model:visible="mostrarConfirmacion" modal header="Confirmación">
      <p class="text-slate-300">{{ confirmacion.mensaje }}</p>

      <template #footer>
        <Button
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmacion = false"
        />
        <Button
          :label="confirmacion.boton"
          severity="danger"
          @click="confirmarAccion"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const seccionActiva = ref('dashboard')
const usuario = ref(null)

const productos = ref([])
const usuarios = ref([])
const pedidos = ref([])
const categorias = ref([])
const pedidosRecientes = ref([])

const mostrarFormNuevoProducto = ref(false)
const mostrarFormNuevaCategoria = ref(false)
const nuevoProducto = ref({ nombre: '', precio: '', categoriaId: '', imagen: '', imagenFile: null })
const nuevaCategoria = ref({ nombre: '' })

const mostrarConfirmacion = ref(false)
const confirmacion = ref({ titulo: '', mensaje: '', boton: '', accion: null, datos: null })

const stats = ref({ productos: 0, usuarios: 0, pedidos: 0, ventas: 0, bajo_stock: 0 })

const imagePreview = ref(null)

const formatPrice = (price) => parseFloat(price || 0).toFixed(2)
const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

const getImageUrl = (image) => {
  if (!image) return 'https://placehold.co/120x120/1f2937/f8fafc?text=No+Image'
  if (image.startsWith('http')) return image
  return `http://localhost:3000${image.startsWith('/') ? image : `/${image}`}`
}

const cargarDatos = async () => {
  try {
    const [resProducts, resCategories] = await Promise.all([
      fetch('http://localhost:3000/api/products'),
      fetch('http://localhost:3000/api/categories')
    ])

    if (resProducts.ok) {
      productos.value = await resProducts.json()
      stats.value.productos = productos.value.length
    }

    if (resCategories.ok) {
      categorias.value = await resCategories.json()
    }

    stats.value.usuarios = 5
    stats.value.pedidos = 12
    stats.value.ventas = 1250.5
    stats.value.bajo_stock = 3
  } catch (error) {
    console.error('Error:', error)
  }
}

const onFileChange = (event) => {
  const file = event?.files?.[0] || event?.target?.files?.[0] || null

  if (file) {
    nuevoProducto.value.imagenFile = file
    imagePreview.value = URL.createObjectURL(file)
  } else {
    nuevoProducto.value.imagenFile = null
    imagePreview.value = null
  }
}

const crearProducto = async () => {
  try {
    const form = new FormData()
    form.append('nombre', nuevoProducto.value.nombre)
    form.append('precio', nuevoProducto.value.precio)
    form.append('categoriaId', nuevoProducto.value.categoriaId)
    if (nuevoProducto.value.imagenFile) {
      form.append('imagen', nuevoProducto.value.imagenFile)
    } else if (nuevoProducto.value.imagen) {
      form.append('imagen', nuevoProducto.value.imagen)
    }

    const res = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      body: form
    })
    if (res.ok) {
      mostrarFormNuevoProducto.value = false
      nuevoProducto.value = { nombre: '', precio: '', categoriaId: '', imagen: '', imagenFile: null }
      imagePreview.value = null
      cargarDatos()
      alert('Producto creado exitosamente')
    } else {
      const err = await res.json()
      console.error('Error creando producto:', err)
      alert('Error creando producto')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const crearCategoria = async () => {
  alert('Implementar endpoint de categorías')
  mostrarFormNuevaCategoria.value = false
}

const eliminarProductoConfirm = (producto) => {
  confirmacion.value = {
    titulo: 'Eliminar Producto',
    mensaje: `¿Estás seguro de que deseas eliminar "${producto.nombre}"?`,
    boton: 'Eliminar',
    accion: 'eliminarProducto',
    datos: producto
  }
  mostrarConfirmacion.value = true
}

const eliminarCategoriaConfirm = (categoria) => {
  confirmacion.value = {
    titulo: 'Eliminar Categoría',
    mensaje: `¿Estás seguro de que deseas eliminar "${categoria.nombre}"?`,
    boton: 'Eliminar',
    accion: 'eliminarCategoria',
    datos: categoria
  }
  mostrarConfirmacion.value = true
}

const confirmarAccion = async () => {
  if (confirmacion.value.accion === 'eliminarProducto') {
    try {
      const res = await fetch(
        `http://localhost:3000/api/products/${confirmacion.value.datos.idProducto}`,
        { method: 'DELETE' }
      )

      if (res.ok) {
        mostrarConfirmacion.value = false
        cargarDatos()
        alert('Producto eliminado exitosamente')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (confirmacion.value.accion === 'eliminarCategoria') {
    try {
      const res = await fetch(
        `http://localhost:3000/api/products/categories/${confirmacion.value.datos.idCategoria}`,
        { method: 'DELETE' }
      )

      if (res.ok) {
        mostrarConfirmacion.value = false
        cargarDatos()
        alert('Categoría eliminada exitosamente')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
}

const cancelarAccion = () => {
  mostrarConfirmacion.value = false
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('nombre')
  localStorage.removeItem('usuario')
  router.push('/login')
}

onMounted(() => {
  const usuarioGuardado = localStorage.getItem('usuario')
  if (usuarioGuardado) usuario.value = JSON.parse(usuarioGuardado)
  cargarDatos()
})
</script>