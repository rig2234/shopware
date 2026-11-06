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
              @click="abrirFormularioNuevo"
            />
          </div>

          <!-- Formulario de producto -->
          <Card v-if="mostrarFormNuevoProducto" class="mb-8">
            <template #title>
              <span class="text-white">
                {{ productoEditandoId ? 'Editar Producto' : 'Crear Nuevo Producto' }}
              </span>
            </template>

            <template #content>
              <form @submit.prevent="guardarProducto" class="space-y-6" enctype="multipart/form-data">
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
                      :min="0"
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

                  <div class="md:col-span-2 lg:col-span-4">
                    <label class="block text-sm font-semibold text-slate-300 mb-3">
                      Tallas y stock
                    </label>

                    <div v-if="tallas.length" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div
                        v-for="talla in tallas"
                        :key="talla.idTalla"
                        class="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 p-4"
                      >
                        <input
                          v-model="tallasSeleccionadas"
                          type="checkbox"
                          :value="talla.idTalla"
                          class="h-4 w-4 accent-emerald-500"
                        />

                        <label class="min-w-10 font-semibold text-white">
                          {{ talla.nombre }}
                        </label>

                        <InputNumber
                          v-model="stockPorTalla[talla.idTalla]"
                          :min="0"
                          :minFractionDigits="0"
                          :maxFractionDigits="0"
                          :showButtons="true"
                          placeholder="Stock"
                          :disabled="!tallasSeleccionadas.includes(talla.idTalla)"
                          class="min-w-0 flex-1"
                        />
                      </div>
                    </div>

                    <p v-else class="text-sm text-amber-300">
                      No se pudieron cargar las tallas. Verifica el endpoint /api/tallas.
                    </p>
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
                      <img :src="imagePreview" alt="Vista previa" class="w-24 h-24 object-cover rounded" />
                    </div>
                    <small v-if="productoEditandoId" class="text-slate-400">
                      Si no seleccionas una imagen nueva, se conservará la actual.
                    </small>
                  </div>
                </div>

                <div class="flex gap-3 justify-end pt-4 border-t border-slate-700">
                  <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    @click="cancelarFormularioProducto"
                  />
                  <Button
                    type="submit"
                    :label="productoEditandoId ? 'Guardar Cambios' : 'Crear Producto'"
                    severity="success"
                  />
                </div>
              </form>
            </template>
          </Card>

          <!-- Tabla de productos -->
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

                <Column header="Stock por talla">
                  <template #body="slotProps">
                    <div v-if="slotProps.data.tallas?.length" class="flex flex-wrap gap-2">
                      <span
                        v-for="productoTalla in slotProps.data.tallas"
                        :key="productoTalla.idProductoTalla"
                        class="bg-slate-700 text-slate-200 px-2 py-1 rounded text-sm"
                      >
                        {{ productoTalla.talla?.nombre || 'Talla' }}:
                        {{ productoTalla.stock ?? 0 }}
                      </span>
                    </div>
                    <span v-else class="text-slate-400">Sin tallas</span>
                  </template>
                </Column>

                <Column header="Acciones">
                  <template #body="slotProps">
                    <div class="flex gap-2">
                      <Button
                        label="Editar"
                        severity="warning"
                        size="small"
                        @click="editarProducto(slotProps.data)"
                      />
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
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">Usuarios</h1>
              <p class="text-slate-400">Gestiona los usuarios registrados</p>
            </div>

            <Button
              label="Nuevo Usuario"
              icon="pi pi-plus"
              severity="primary"
              @click="abrirFormularioUsuario"
            />
          </div>

          <Card v-if="mostrarFormularioUsuario" class="mb-8">
            <template #title>
              <span class="text-white">
                {{ usuarioEditandoId ? 'Editar Usuario' : 'Crear Usuario' }}
              </span>
            </template>

            <template #content>
              <form @submit.prevent="guardarUsuario" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-2">
                    <label class="text-slate-300">Nombre</label>
                    <InputText v-model="formUsuario.nombre" placeholder="Nombre del usuario" />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-slate-300">Correo</label>
                    <InputText
                      v-model="formUsuario.correo"
                      type="email"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-slate-300">
                      Contraseña
                      <span v-if="usuarioEditandoId">(dejar vacía para conservarla)</span>
                    </label>
                    <InputText
                      v-model="formUsuario.contrasena"
                      type="password"
                      :placeholder="usuarioEditandoId ? 'Sin cambios' : 'Mínimo 8 caracteres'"
                    />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-slate-300">Rol</label>
                    <Dropdown
                      v-model="formUsuario.idRol"
                      :options="roles"
                      optionLabel="nombreRol"
                      optionValue="idRol"
                      placeholder="Selecciona un rol"
                    />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-slate-300">Estado</label>
                    <Dropdown
                      v-model="formUsuario.estatus"
                      :options="estadosUsuario"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Selecciona un estado"
                    />
                  </div>
                </div>

                <div class="flex gap-3 justify-end pt-4 border-t border-slate-700">
                  <Button
                    type="button"
                    label="Cancelar"
                    severity="secondary"
                    @click="cancelarFormularioUsuario"
                  />
                  <Button
                    type="submit"
                    :label="usuarioEditandoId ? 'Guardar Cambios' : 'Crear Usuario'"
                    severity="success"
                  />
                </div>
              </form>
            </template>
          </Card>

          <Card>
            <template #content>
              <DataTable
                :value="usuarios"
                tableStyle="min-width: 100%"
                paginator
                :rows="10"
                responsiveLayout="scroll"
              >
                <Column field="idUsuario" header="ID">
                  <template #body="slotProps">
                    <span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                      #{{ slotProps.data.idUsuario }}
                    </span>
                  </template>
                </Column>

                <Column field="nombre" header="Nombre" />
                <Column field="correo" header="Correo" />

                <Column header="Rol">
                  <template #body="slotProps">
                    {{ slotProps.data.rol?.nombreRol || 'N/A' }}
                  </template>
                </Column>

                <Column field="estatus" header="Estado">
                  <template #body="slotProps">
                    <Tag
                      :value="slotProps.data.estatus || 'Sin estado'"
                      :severity="slotProps.data.estatus === 'activo' ? 'success' : 'danger'"
                    />
                  </template>
                </Column>

                <Column header="Acciones">
                  <template #body="slotProps">
                    <div class="flex gap-2">
                      <Button
                        label="Editar"
                        severity="warning"
                        size="small"
                        @click="editarUsuario(slotProps.data)"
                      />
                      <Button
                        label="Eliminar"
                        severity="danger"
                        size="small"
                        @click="eliminarUsuarioConfirm(slotProps.data)"
                      />
                    </div>
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
      @click="abrirFormularioCategoria"
    />
  </div>

  <Card v-if="mostrarFormNuevaCategoria" class="mb-8">
    <template #title>
      <span class="text-white">
        {{ categoriaEditandoId ? 'Editar Categoría' : 'Crear Nueva Categoría' }}
      </span>
    </template>

    <template #content>
      <form @submit.prevent="guardarCategoria" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-slate-300 block mb-2">Nombre de la categoría</label>
            <InputText
              v-model="nuevaCategoria.nombre"
              placeholder="Ej: Camisetas"
            />
          </div>

          <div>
            <label class="text-slate-300 block mb-2">Categoría padre</label>
            <Dropdown
              v-model="nuevaCategoria.parentId"
              :options="categoriasPadre"
              optionLabel="nombre"
              optionValue="idCategoria"
              placeholder="Selecciona Hombre o Mujer"
            />
            <p v-if="!categoriasPadre.length" class="text-sm text-amber-300 mt-2">
              No se encontraron categorías raíz Hombre/Mujer. Verifica que existan en la base de datos.
            </p>
          </div>
        </div>

        <div class="flex gap-3 justify-end pt-4 border-t border-slate-700">
          <Button
            type="button"
            label="Cancelar"
            severity="secondary"
            @click="cancelarFormularioCategoria"
          />
          <Button
            type="submit"
            :label="categoriaEditandoId ? 'Guardar Cambios' : 'Crear Categoría'"
            severity="success"
          />
        </div>
      </form>
    </template>
  </Card>

  <Card>
    <template #content>
      <DataTable
        :value="categorias"
        tableStyle="min-width: 100%"
        paginator
        :rows="10"
        responsiveLayout="scroll"
      >
        <Column field="idCategoria" header="ID">
          <template #body="slotProps">
            <span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
              #{{ slotProps.data.idCategoria }}
            </span>
          </template>
        </Column>

        <Column header="Categoría">
          <template #body="slotProps">
            {{ slotProps.data.nombreCompleto || slotProps.data.nombre }}
          </template>
        </Column>

        <Column header="Padre">
          <template #body="slotProps">
            {{ slotProps.data.parent?.nombre || 'Categoría raíz' }}
          </template>
        </Column>

        <Column field="productos" header="Productos">
          <template #body="slotProps">
            {{ slotProps.data.productos?.length || 0 }}
          </template>
        </Column>

        <Column header="Acciones">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                v-if="slotProps.data.parentId != null"
                label="Editar"
                severity="warning"
                size="small"
                @click="editarCategoria(slotProps.data)"
              />
              <Button
                label="Eliminar"
                severity="danger"
                size="small"
                @click="eliminarCategoriaConfirm(slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</div>
      </div>
    </main>

    <!-- Modal de confirmación -->
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

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()

const seccionActiva = ref('dashboard')
const usuario = ref(null)

const productos = ref([])
const usuarios = ref([])
const pedidos = ref([])
const categorias = ref([])
const tallas = ref([])
const tallasSeleccionadas = ref([])
const stockPorTalla = ref({})
const pedidosRecientes = ref([])
const roles = ref([])

const mostrarFormNuevoProducto = ref(false)
const mostrarFormNuevaCategoria = ref(false)
const mostrarFormularioUsuario = ref(false)
const productoEditandoId = ref(null)
const usuarioEditandoId = ref(null)
const categoriaEditandoId = ref(null)

const estadosUsuario = [
  { label: 'Activo', value: 'activo' },
  { label: 'Inactivo', value: 'inactivo' }
]

const formularioUsuarioVacio = () => ({
  nombre: '',
  correo: '',
  contrasena: '',
  idRol: null,
  estatus: 'activo'
})

const formUsuario = ref(formularioUsuarioVacio())

const nuevoProductoVacio = () => ({
  nombre: '',
  precio: '',
  categoriaId: '',
  tallaId: '',
  stock: 0,
  imagen: '',
  imagenFile: null
})

const nuevoProducto = ref(nuevoProductoVacio())

const nuevaCategoria = ref({
  nombre: '',
  parentId: null
})

const categoriasPadre = computed(() =>
  categorias.value.filter((categoria) => {
    const nombre = String(categoria.nombre || '').trim().toLowerCase()

    return categoria.parentId == null &&
      ['hombre', 'mujer'].includes(nombre)
  })
)

const mostrarConfirmacion = ref(false)
const confirmacion = ref({
  titulo: '',
  mensaje: '',
  boton: '',
  accion: null,
  datos: null
})

const stats = ref({
  productos: 0,
  usuarios: 0,
  pedidos: 0,
  ventas: 0,
  bajo_stock: 0
})

const imagePreview = ref(null)

const formatPrice = (price) => parseFloat(price || 0).toFixed(2)

const formatDate = (date) => {
  if (!date) return 'N/A'

  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getImageUrl = (image) => {
  if (!image) return 'https://placehold.co/120x120/1f2937/f8fafc?text=No+Image'
  if (image.startsWith('http')) return image
  return `http://localhost:3000${image.startsWith('/') ? image : `/${image}`}`
}

const cargarDatos = async () => {
  try {
    const token = localStorage.getItem('token')
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {}

    const [resProducts, resCategories, resTallas, resUsers, resRoles] =
      await Promise.all([
        fetch('http://localhost:3000/api/products'),
        fetch('http://localhost:3000/api/categories'),
        fetch('http://localhost:3000/api/tallas'),
        fetch('http://localhost:3000/api/users', { headers }),
        fetch('http://localhost:3000/api/users/roles', { headers })
      ])

    if (resProducts.ok) {
      productos.value = await resProducts.json()
      stats.value.productos = productos.value.length
    }

    if (resCategories.ok) {
      categorias.value = await resCategories.json()
    }

    if (resTallas.ok) {
      tallas.value = await resTallas.json()
    }

    if (resUsers.ok) {
      usuarios.value = await resUsers.json()
      stats.value.usuarios = usuarios.value.length
    } else {
      const error = await resUsers.json().catch(() => ({}))
      console.error('Error cargando usuarios:', error)

      if (resUsers.status === 401 || resUsers.status === 403) {
        toast.add({
          severity: 'warn',
          summary: 'Acceso denegado',
          detail: error.message || 'Inicia sesión con una cuenta de administrador.',
          life: 3500
        })
      }
    }

    if (resRoles.ok) {
      roles.value = await resRoles.json()
    } else {
      const error = await resRoles.json().catch(() => ({}))
      console.error('Error cargando roles:', error)
    }

    // Estos valores siguen siendo de ejemplo hasta conectar sus endpoints.
    stats.value.pedidos = 12
    stats.value.ventas = 1250.5
    stats.value.bajo_stock = 3
  } catch (error) {
    console.error('Error cargando datos:', error)
    toast.add({
      severity: 'error',
      summary: 'Error de conexión',
      detail: 'No se pudieron cargar los datos. Verifica que el backend esté iniciado.',
      life: 3500
    })
  }
}

const revocarVistaPrevia = () => {
  if (imagePreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value)
  }
}

const limpiarFormularioProducto = () => {
  revocarVistaPrevia()

  productoEditandoId.value = null
  nuevoProducto.value = nuevoProductoVacio()
  tallasSeleccionadas.value = []
  stockPorTalla.value = {}
  imagePreview.value = null
}

const abrirFormularioNuevo = () => {
  limpiarFormularioProducto()
  mostrarFormNuevoProducto.value = true
}

const cancelarFormularioProducto = () => {
  mostrarFormNuevoProducto.value = false
  limpiarFormularioProducto()
}

const editarProducto = (producto) => {
  revocarVistaPrevia()

  productoEditandoId.value = producto.idProducto
  nuevoProducto.value = {
    nombre: producto.nombre || '',
    precio: producto.precio === null ? null : Number(producto.precio),
    categoriaId: producto.categoriaId || '',
    tallaId: '',
    stock: 0,
    imagen: producto.imagen || '',
    imagenFile: null
  }

  const tallasProducto = producto.tallas || []

  // Incluye también tallas con stock 0 para que el admin pueda editarlas.
  tallasSeleccionadas.value = tallasProducto.map(
    (productoTalla) => productoTalla.idTalla
  )

  stockPorTalla.value = Object.fromEntries(
    tallasProducto.map((productoTalla) => [
      productoTalla.idTalla,
      Number(productoTalla.stock || 0)
    ])
  )

  imagePreview.value = producto.imagen
    ? getImageUrl(producto.imagen)
    : null

  mostrarFormNuevoProducto.value = true
  seccionActiva.value = 'productos'
}

const onFileChange = (event) => {
  const file = event?.files?.[0] || event?.target?.files?.[0] || null

  revocarVistaPrevia()
  nuevoProducto.value.imagenFile = file

  if (file) {
    imagePreview.value = URL.createObjectURL(file)
  } else if (productoEditandoId.value && nuevoProducto.value.imagen) {
    imagePreview.value = getImageUrl(nuevoProducto.value.imagen)
  } else {
    imagePreview.value = null
  }
}

const guardarProducto = async () => {
  const nombre = String(nuevoProducto.value.nombre || '').trim()

  if (!nombre) {
    toast.add({
      severity: 'warn',
      summary: 'Nombre requerido',
      detail: 'Escribe el nombre del producto.',
      life: 2500
    })
    return
  }

  const tallasDelProducto = tallasSeleccionadas.value.map((idTalla) => ({
    idTalla: Number(idTalla),
    stock: Number(stockPorTalla.value[idTalla] ?? 0)
  }))

  const tallasInvalidas = tallasDelProducto.some(
    (talla) =>
      !Number.isInteger(talla.idTalla) ||
      talla.idTalla <= 0 ||
      !Number.isInteger(talla.stock) ||
      talla.stock < 0
  )

  if (tallasDelProducto.length === 0 || tallasInvalidas) {
    toast.add({
      severity: 'warn',
      summary: 'Tallas y stock',
      detail: 'Selecciona al menos una talla e indica un stock válido.',
      life: 2500
    })
    return
  }

  const precio = nuevoProducto.value.precio
  if (
    precio !== null &&
    precio !== '' &&
    (!Number.isFinite(Number(precio)) || Number(precio) < 0)
  ) {
    toast.add({
      severity: 'warn',
      summary: 'Precio inválido',
      detail: 'El precio debe ser un número igual o mayor que cero.',
      life: 2500
    })
    return
  }

  const editando = Boolean(productoEditandoId.value)

  try {
    const form = new FormData()
    form.append('nombre', nombre)
    form.append('precio', String(precio ?? ''))
    form.append('categoriaId', String(nuevoProducto.value.categoriaId ?? ''))
    form.append('tallas', JSON.stringify(tallasDelProducto))

    if (nuevoProducto.value.imagenFile) {
      form.append('imagen', nuevoProducto.value.imagenFile)
    }

    const url = editando
      ? `http://localhost:3000/api/products/${productoEditandoId.value}`
      : 'http://localhost:3000/api/products'

    const res = await fetch(url, {
      method: editando ? 'PUT' : 'POST',
      body: form
    })

    const resultado = await res.json().catch(() => ({}))

    if (!res.ok) {
      console.error('Error guardando producto:', resultado)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: resultado.error || 'No se pudo guardar el producto.',
        life: 3000
      })
      return
    }

    mostrarFormNuevoProducto.value = false
    limpiarFormularioProducto()
    await cargarDatos()

    toast.add({
      severity: 'success',
      summary: editando ? 'Producto actualizado' : 'Producto creado',
      detail: editando
        ? 'Se guardaron los cambios del producto y su stock por talla.'
        : 'El producto se registró correctamente.',
      life: 2500
    })
  } catch (error) {
    console.error('Error guardando producto:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un problema al guardar el producto.',
      life: 2500
    })
  }
}

const abrirFormularioUsuario = () => {
  usuarioEditandoId.value = null
  formUsuario.value = formularioUsuarioVacio()
  mostrarFormularioUsuario.value = true
}

const cancelarFormularioUsuario = () => {
  mostrarFormularioUsuario.value = false
  usuarioEditandoId.value = null
  formUsuario.value = formularioUsuarioVacio()
}

const editarUsuario = (user) => {
  usuarioEditandoId.value = user.idUsuario
  formUsuario.value = {
    nombre: user.nombre || '',
    correo: user.correo || '',
    contrasena: '',
    idRol: user.idRol,
    estatus: user.estatus || 'activo'
  }
  mostrarFormularioUsuario.value = true
}

const guardarUsuario = async () => {
  const nombre = formUsuario.value.nombre.trim()
  const correo = formUsuario.value.correo.trim()
  const contrasena = formUsuario.value.contrasena
  const editando = Boolean(usuarioEditandoId.value)
  const token = localStorage.getItem('token')

  if (!nombre || !correo || !formUsuario.value.idRol) {
    toast.add({
      severity: 'warn',
      summary: 'Datos incompletos',
      detail: 'Completa el nombre, correo y rol.',
      life: 2500
    })
    return
  }

  if (!token) {
    toast.add({
      severity: 'error',
      summary: 'Sesión no encontrada',
      detail: 'Inicia sesión nuevamente como administrador.',
      life: 3000
    })
    return
  }

  if (!editando && contrasena.length < 8) {
    toast.add({
      severity: 'warn',
      summary: 'Contraseña inválida',
      detail: 'La contraseña debe tener al menos 8 caracteres.',
      life: 2500
    })
    return
  }

  if (editando && contrasena && contrasena.length < 8) {
    toast.add({
      severity: 'warn',
      summary: 'Contraseña inválida',
      detail: 'Si cambias la contraseña, debe tener al menos 8 caracteres.',
      life: 2500
    })
    return
  }

  try {
    const res = await fetch(
      editando
        ? `http://localhost:3000/api/users/${usuarioEditandoId.value}`
        : 'http://localhost:3000/api/users',
      {
        method: editando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre,
          correo,
          contrasena,
          idRol: Number(formUsuario.value.idRol),
          estatus: formUsuario.value.estatus
        })
      }
    )

    const resultado = await res.json().catch(() => ({}))

    if (!res.ok) {
      toast.add({
        severity: 'error',
        summary: 'No se pudo guardar',
        detail: resultado.error || 'Ocurrió un error al guardar el usuario.',
        life: 3000
      })
      return
    }

    cancelarFormularioUsuario()
    await cargarDatos()

    toast.add({
      severity: 'success',
      summary: editando ? 'Usuario actualizado' : 'Usuario creado',
      detail: editando
        ? 'Se guardaron los cambios del usuario.'
        : 'El usuario se creó correctamente.',
      life: 2500
    })
  } catch (error) {
    console.error('Error guardando usuario:', error)
    toast.add({
      severity: 'error',
      summary: 'Error de conexión',
      detail: 'No se pudo conectar con el servidor.',
      life: 3000
    })
  }
}

const eliminarUsuarioConfirm = (user) => {
  confirmacion.value = {
    titulo: 'Eliminar Usuario',
    mensaje: `¿Estás seguro de que deseas eliminar a "${user.nombre}"?`,
    boton: 'Eliminar',
    accion: 'eliminarUsuario',
    datos: user
  }

  mostrarConfirmacion.value = true
}

const abrirFormularioCategoria = () => {
  categoriaEditandoId.value = null
  nuevaCategoria.value = {
    nombre: '',
    parentId: null
  }
  mostrarFormNuevaCategoria.value = true
}

const cancelarFormularioCategoria = () => {
  mostrarFormNuevaCategoria.value = false
  categoriaEditandoId.value = null
  nuevaCategoria.value = {
    nombre: '',
    parentId: null
  }
}

const editarCategoria = (categoria) => {
  categoriaEditandoId.value = categoria.idCategoria
  nuevaCategoria.value = {
    nombre: categoria.nombre || '',
    parentId: categoria.parentId
  }
  mostrarFormNuevaCategoria.value = true
  seccionActiva.value = 'categorias'
}

const guardarCategoria = async () => {
  const nombre = String(nuevaCategoria.value.nombre || '').trim()
  const parentId = Number(nuevaCategoria.value.parentId)
  const token = localStorage.getItem('token')
  const editando = Boolean(categoriaEditandoId.value)

  if (!nombre || !Number.isInteger(parentId) || parentId <= 0) {
    toast.add({
      severity: 'warn',
      summary: 'Datos incompletos',
      detail: 'Escribe el nombre y selecciona Hombre o Mujer como padre.',
      life: 3000
    })
    return
  }

  if (!token) {
    toast.add({
      severity: 'error',
      summary: 'Sesión no encontrada',
      detail: 'Inicia sesión nuevamente como administrador.',
      life: 3000
    })
    return
  }

  try {
    const url = editando
      ? `http://localhost:3000/api/categories/${categoriaEditandoId.value}`
      : 'http://localhost:3000/api/categories'

    const res = await fetch(url, {
      method: editando ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ nombre, parentId })
    })

    const resultado = await res.json().catch(() => ({}))

    if (!res.ok) {
      toast.add({
        severity: 'error',
        summary: editando ? 'No se pudo actualizar' : 'No se pudo crear',
        detail: resultado.error || 'Ocurrió un error con la categoría.',
        life: 3000
      })
      return
    }

    cancelarFormularioCategoria()
    await cargarDatos()

    toast.add({
      severity: 'success',
      summary: editando ? 'Categoría actualizada' : 'Categoría creada',
      detail: editando
        ? 'Se guardaron los cambios de la categoría.'
        : 'La categoría se creó correctamente.',
      life: 2500
    })
  } catch (error) {
    console.error('Error guardando categoría:', error)
    toast.add({
      severity: 'error',
      summary: 'Error de conexión',
      detail: 'No se pudo conectar con el servidor.',
      life: 3000
    })
  }
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
  if (confirmacion.value.accion === 'eliminarCategoria') {
  const categoria = confirmacion.value.datos
  const token = localStorage.getItem('token')

  if (!token) {
    toast.add({
      severity: 'error',
      summary: 'Sesión no encontrada',
      detail: 'Inicia sesión nuevamente como administrador.',
      life: 3000
    })
    return
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/categories/${categoria.idCategoria}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const resultado = await res.json().catch(() => ({}))

    if (!res.ok) {
      toast.add({
        severity: 'error',
        summary: 'No se pudo eliminar',
        detail: resultado.error || 'Ocurrió un error al eliminar la categoría.',
        life: 3000
      })
      return
    }

    mostrarConfirmacion.value = false
    await cargarDatos()

    toast.add({
      severity: 'success',
      summary: 'Categoría eliminada',
      detail: 'La categoría se eliminó y sus productos quedaron sin categoría.',
      life: 2500
    })
  } catch (error) {
    console.error('Error eliminando categoría:', error)
    toast.add({
      severity: 'error',
      summary: 'Error de conexión',
      detail: 'No se pudo conectar con el servidor.',
      life: 3000
    })
  }

  return
}

  // La API de categorías debe implementar DELETE antes de habilitar esta acción.
  /*if (confirmacion.value.accion === 'eliminarCategoria') {
    toast.add({
      severity: 'warn',
      summary: 'Acción no disponible',
      detail: 'El backend todavía no tiene un endpoint para eliminar categorías.',
      life: 3000
    })
    return
  }*/

  if (confirmacion.value.accion !== 'eliminarProducto') return

  try {
    const res = await fetch(
      `http://localhost:3000/api/products/${confirmacion.value.datos.idProducto}`,
      { method: 'DELETE' }
    )

    const resultado = await res.json().catch(() => ({}))

    if (!res.ok) {
      console.error('Error eliminando producto:', resultado)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: resultado.error || 'No se pudo eliminar el producto.',
        life: 2500
      })
      return
    }

    mostrarConfirmacion.value = false
    await cargarDatos()

    toast.add({
      severity: 'success',
      summary: 'Producto eliminado',
      detail: 'El producto se eliminó correctamente.',
      life: 2500
    })
  } catch (error) {
    console.error('Error eliminando producto:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un problema al eliminar el producto.',
      life: 2500
    })
  }
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('nombre')
  localStorage.removeItem('usuario')
  router.push('/login')
}

onMounted(() => {
  const usuarioGuardado = localStorage.getItem('usuario')

  if (usuarioGuardado) {
    try {
      usuario.value = JSON.parse(usuarioGuardado)
    } catch (error) {
      console.error('No se pudo leer el usuario guardado:', error)
    }
  }

  cargarDatos()
})
</script>