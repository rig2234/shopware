<template>
  <div class="min-h-screen bg-slate-950 text-white flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 border-r border-slate-800 fixed h-screen flex flex-col">
      <div class="p-6 border-b border-slate-800">
        <h1 class="text-2xl font-bold text-amber-500 mb-2">Admin Panel</h1>
        <p class="text-sm text-slate-400">{{ usuario?.nombre || 'Administrador' }}</p>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <button
          @click="seccionActiva = 'dashboard'"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left',
            seccionActiva === 'dashboard'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Dashboard
        </button>
        <button
          @click="seccionActiva = 'productos'"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left',
            seccionActiva === 'productos'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
          Productos
        </button>
        <button
          @click="seccionActiva = 'usuarios'"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left',
            seccionActiva === 'usuarios'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Usuarios
        </button>
        <button
          @click="seccionActiva = 'pedidos'"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left',
            seccionActiva === 'pedidos'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Pedidos
        </button>
        <button
          @click="seccionActiva = 'categorias'"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left',
            seccionActiva === 'categorias'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          Categorías
        </button>
      </nav>

      <div class="p-4 border-t border-slate-800">
        <button
          @click="cerrarSesion"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-950 text-red-400 hover:bg-red-900 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
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

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <p class="text-slate-400 text-sm mb-2">Total Productos</p>
                  <p class="text-3xl font-bold text-white">{{ stats.productos }}</p>
                </div>
                <div class="bg-blue-500/20 p-3 rounded-lg text-blue-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-1">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <p class="text-slate-400 text-sm mb-2">Total Usuarios</p>
                  <p class="text-3xl font-bold text-white">{{ stats.usuarios }}</p>
                </div>
                <div class="bg-green-500/20 p-3 rounded-lg text-green-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <p class="text-slate-400 text-sm mb-2">Total Pedidos</p>
                  <p class="text-3xl font-bold text-white">{{ stats.pedidos }}</p>
                </div>
                <div class="bg-purple-500/20 p-3 rounded-lg text-purple-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-amber-500 transition-all hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <p class="text-slate-400 text-sm mb-2">Ventas Totales</p>
                  <p class="text-3xl font-bold text-white">${{ formatPrice(stats.ventas) }}</p>
                </div>
                <div class="bg-amber-500/20 p-3 rounded-lg text-amber-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Alert -->
          <div v-if="stats.bajo_stock > 0" class="bg-amber-950 border-l-4 border-amber-500 p-4 rounded mb-8 flex items-center gap-3">
            <svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            </svg>
            <span class="text-amber-100">Hay <strong>{{ stats.bajo_stock }}</strong> producto(s) con bajo stock. <a href="#" @click.prevent="seccionActiva = 'productos'" class="underline hover:no-underline">Ver productos</a></span>
          </div>

          <!-- Recent Orders -->
          <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div class="p-6 border-b border-slate-700">
              <h2 class="text-xl font-bold text-white">Pedidos Recientes</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-slate-700 bg-slate-900/50">
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">ID Pedido</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Cliente</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Fecha</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-700">
                  <tr v-if="pedidosRecientes.length === 0" class="hover:bg-slate-700/50">
                    <td colspan="4" class="px-6 py-8 text-center text-slate-400">No hay pedidos registrados</td>
                  </tr>
                  <tr v-for="pedido in pedidosRecientes" :key="pedido.idPedido" class="hover:bg-slate-700/50 transition-colors">
                    <td class="px-6 py-4"><span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">#{{ pedido.idPedido }}</span></td>
                    <td class="px-6 py-4 text-slate-200">{{ pedido.usuario?.nombre || 'N/A' }}</td>
                    <td class="px-6 py-4 text-slate-400">{{ formatDate(pedido.fechaPedido) }}</td>
                    <td class="px-6 py-4 text-green-400 font-semibold">${{ formatPrice(pedido.total) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Productos -->
        <div v-if="seccionActiva === 'productos'">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">Productos</h1>
              <p class="text-slate-400">Gestiona el catálogo de productos</p>
            </div>
            <button
              @click="mostrarFormNuevoProducto = !mostrarFormNuevoProducto"
              class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Nuevo Producto
            </button>
          </div>

          <!-- Formulario -->
          <div v-if="mostrarFormNuevoProducto" class="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8 animate-in fade-in duration-300">
            <h3 class="text-xl font-bold text-white mb-2">Crear Nuevo Producto</h3>
            <p class="text-slate-400 mb-6">Completa los datos del producto</p>

            <form @submit.prevent="crearProducto" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">Nombre</label>
                  <input
                    v-model="nuevoProducto.nombre"
                    type="text"
                    placeholder="Ej: Camiseta Azul"
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">Precio</label>
                  <input
                    v-model.number="nuevoProducto.precio"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">Categoría</label>
                  <select
                    v-model="nuevoProducto.categoriaId"
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                    required
                  >
                    <option value="">Selecciona...</option>
                    <option v-for="cat in categorias" :key="cat.idCategoria" :value="cat.idCategoria">
                      {{ cat.nombre }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-300 mb-2">Imagen (URL)</label>
                  <input
                    v-model="nuevoProducto.imagen"
                    type="text"
                    placeholder="/uploads/producto.jpg"
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
              </div>

              <div class="flex gap-3 justify-end pt-4 border-t border-slate-700">
                <button
                  type="button"
                  @click="mostrarFormNuevoProducto = false"
                  class="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all"
                >
                  Crear Producto
                </button>
              </div>
            </form>
          </div>

          <!-- Tabla -->
          <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-slate-700 bg-slate-900/50">
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">ID</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Nombre</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Precio</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Categoría</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-700">
                  <tr v-if="productos.length === 0" class="hover:bg-slate-700/50">
                    <td colspan="5" class="px-6 py-8 text-center text-slate-400">No hay productos registrados</td>
                  </tr>
                  <tr v-for="producto in productos" :key="producto.idProducto" class="hover:bg-slate-700/50 transition-colors">
                    <td class="px-6 py-4"><span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">#{{ producto.idProducto }}</span></td>
                    <td class="px-6 py-4 text-slate-200">{{ producto.nombre }}</td>
                    <td class="px-6 py-4 text-green-400 font-semibold">${{ formatPrice(producto.precio) }}</td>
                    <td class="px-6 py-4 text-slate-400">{{ producto.categoria?.nombre || 'N/A' }}</td>
                    <td class="px-6 py-4 space-x-2">
                      <button class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-all">Editar</button>
                      <button @click="eliminarProductoConfirm(producto)" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-all">Eliminar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Usuarios -->
        <div v-if="seccionActiva === 'usuarios'">
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-white mb-2">Usuarios</h1>
            <p class="text-slate-400">Gestiona los usuarios registrados</p>
          </div>

          <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-slate-700 bg-slate-900/50">
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">ID</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Nombre</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Correo</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Rol</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-700">
                  <tr v-if="usuarios.length === 0" class="hover:bg-slate-700/50">
                    <td colspan="5" class="px-6 py-8 text-center text-slate-400">No hay usuarios registrados</td>
                  </tr>
                  <tr v-for="user in usuarios" :key="user.idUsuario" class="hover:bg-slate-700/50 transition-colors">
                    <td class="px-6 py-4"><span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">#{{ user.idUsuario }}</span></td>
                    <td class="px-6 py-4 text-slate-200">{{ user.nombre }}</td>
                    <td class="px-6 py-4 text-slate-400">{{ user.correo }}</td>
                    <td class="px-6 py-4 text-slate-400">{{ user.rol?.nombreRol || 'N/A' }}</td>
                    <td class="px-6 py-4">
                      <span :class="[
                        'px-3 py-1 rounded-full text-sm font-semibold',
                        user.estatus === 'activo'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      ]">
                        {{ user.estatus }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Pedidos -->
        <div v-if="seccionActiva === 'pedidos'">
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-white mb-2">Pedidos</h1>
            <p class="text-slate-400">Historial de pedidos realizados</p>
          </div>

          <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-slate-700 bg-slate-900/50">
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">ID Pedido</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Cliente</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Fecha</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Total</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Artículos</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-700">
                  <tr v-if="pedidos.length === 0" class="hover:bg-slate-700/50">
                    <td colspan="5" class="px-6 py-8 text-center text-slate-400">No hay pedidos registrados</td>
                  </tr>
                  <tr v-for="pedido in pedidos" :key="pedido.idPedido" class="hover:bg-slate-700/50 transition-colors">
                    <td class="px-6 py-4"><span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">#{{ pedido.idPedido }}</span></td>
                    <td class="px-6 py-4 text-slate-200">{{ pedido.usuario?.nombre || 'N/A' }}</td>
                    <td class="px-6 py-4 text-slate-400">{{ formatDate(pedido.fechaPedido) }}</td>
                    <td class="px-6 py-4 text-green-400 font-semibold">${{ formatPrice(pedido.total) }}</td>
                    <td class="px-6 py-4 text-slate-400">{{ pedido.detalles?.length || 0 }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Categorías -->
        <div v-if="seccionActiva === 'categorias'">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">Categorías</h1>
              <p class="text-slate-400">Gestiona las categorías de productos</p>
            </div>
            <button
              @click="mostrarFormNuevaCategoria = !mostrarFormNuevaCategoria"
              class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Nueva Categoría
            </button>
          </div>

          <!-- Formulario -->
          <div v-if="mostrarFormNuevaCategoria" class="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8 animate-in fade-in duration-300">
            <h3 class="text-xl font-bold text-white mb-2">Crear Nueva Categoría</h3>
            <p class="text-slate-400 mb-6">Agrega una nueva categoría al sistema</p>

            <form @submit.prevent="crearCategoria" class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">Nombre</label>
                <input
                  v-model="nuevaCategoria.nombre"
                  type="text"
                  placeholder="Ej: Camisetas"
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  required
                />
              </div>

              <div class="flex gap-3 justify-end pt-4 border-t border-slate-700">
                <button
                  type="button"
                  @click="mostrarFormNuevaCategoria = false"
                  class="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all"
                >
                  Crear Categoría
                </button>
              </div>
            </form>
          </div>

          <!-- Tabla -->
          <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-slate-700 bg-slate-900/50">
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">ID</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Nombre</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Productos</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-700">
                  <tr v-if="categorias.length === 0" class="hover:bg-slate-700/50">
                    <td colspan="4" class="px-6 py-8 text-center text-slate-400">No hay categorías registradas</td>
                  </tr>
                  <tr v-for="cat in categorias" :key="cat.idCategoria" class="hover:bg-slate-700/50 transition-colors">
                    <td class="px-6 py-4"><span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">#{{ cat.idCategoria }}</span></td>
                    <td class="px-6 py-4 text-slate-200">{{ cat.nombre }}</td>
                    <td class="px-6 py-4 text-slate-400">{{ cat.productos?.length || 0 }}</td>
                    <td class="px-6 py-4">
                      <button @click="eliminarCategoriaConfirm(cat)" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-all">Eliminar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Confirmación -->
    <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-md w-full mx-4 animate-in scale-95 duration-300">
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-amber-500/20 p-3 rounded-full text-amber-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">{{ confirmacion.titulo }}</h3>
        <p class="text-slate-400 mb-6">{{ confirmacion.mensaje }}</p>
        <div class="flex gap-3 justify-end">
          <button
            @click="cancelarAccion"
            class="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-all"
          >
            Cancelar
          </button>
          <button
            @click="confirmarAccion"
            class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
          >
            {{ confirmacion.boton }}
          </button>
        </div>
      </div>
    </div>
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
const nuevoProducto = ref({ nombre: '', precio: '', categoriaId: '', imagen: '' })
const nuevaCategoria = ref({ nombre: '' })

const mostrarConfirmacion = ref(false)
const confirmacion = ref({ titulo: '', mensaje: '', boton: '', accion: null, datos: null })

const stats = ref({ productos: 0, usuarios: 0, pedidos: 0, ventas: 0, bajo_stock: 0 })

const formatPrice = (price) => parseFloat(price).toFixed(2)
const formatDate = (date) => new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })

const cargarDatos = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/products')
    if (res.ok) {
      productos.value = await res.json()
      stats.value.productos = productos.value.length
    }
    stats.value.usuarios = 5
    stats.value.pedidos = 12
    stats.value.ventas = 1250.50
    stats.value.bajo_stock = 3
  } catch (error) {
    console.error('Error:', error)
  }
}

const crearProducto = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto.value)
    })
    if (res.ok) {
      mostrarFormNuevoProducto.value = false
      nuevoProducto.value = { nombre: '', precio: '', categoriaId: '', imagen: '' }
      cargarDatos()
      alert('Producto creado exitosamente')
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
      const res = await fetch(`http://localhost:3000/api/products/${confirmacion.value.datos.idProducto}`, { method: 'DELETE' })
      if (res.ok) {
        mostrarConfirmacion.value = false
        cargarDatos()
        alert('Producto eliminado exitosamente')
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
  localStorage.removeItem('usuario')
  router.push('/login')
}

onMounted(() => {
  const usuarioGuardado = localStorage.getItem('usuario')
  if (usuarioGuardado) usuario.value = JSON.parse(usuarioGuardado)
  cargarDatos()
})
</script>
