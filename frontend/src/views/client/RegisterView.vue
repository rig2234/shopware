<template>
  <div class="min-h-screen bg-[#181616] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
    
    <!-- Resplandor decorativo -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-[#D99B6A]/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-[#D99B6A]/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Encabezado / Logo -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
      <h1 class="text-4xl font-extrabold tracking-wider mb-2">
        Shopware<span class="text-[#D99B6A]">©</span>
      </h1>
      <h2 class="text-lg font-medium text-gray-300">
        {{ paso === 1 ? 'Bienvenido a la experiencia' : 'Verificación de Correo' }}
      </h2>
      <p class="mt-2 text-sm text-gray-400">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="font-semibold text-[#D99B6A] hover:underline transition-all ml-1">
          Inicia sesión
        </router-link>
      </p>
    </div>

    <!-- Tarjeta del Formulario -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
      <div class="bg-[#211F1F]/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-[#332F2E]">
        
        <!-- PASO 1: Ingreso de datos iniciales -->
        <form v-if="paso === 1" class="space-y-5" @submit.prevent="handleSolicitarCodigo">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Nombre de usuario</label>
            <input 
              v-model="form.nombre" 
              type="text" 
              required 
              placeholder="Ej. rigoberto"
              class="w-full px-4 py-3 bg-[#181616] border border-[#3D3837] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D99B6A] focus:ring-1 focus:ring-[#D99B6A] transition-all text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Correo electrónico</label>
            <input 
              v-model="form.correo" 
              type="email" 
              required 
              placeholder="correo@ejemplo.com"
              class="w-full px-4 py-3 bg-[#181616] border border-[#3D3837] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D99B6A] focus:ring-1 focus:ring-[#D99B6A] transition-all text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
            <div class="relative">
              <input 
                v-model="form.contrasena" 
                :type="verPassword ? 'text' : 'password'" 
                required 
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-[#181616] border border-[#3D3837] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D99B6A] focus:ring-1 focus:ring-[#D99B6A] transition-all text-sm pr-10"
              />
              <button 
                type="button" 
                @click="verPassword = !verPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#D99B6A] transition-colors"
              >
                <i :class="verPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
          </div>

          <div 
            v-if="mensaje.texto" 
            :class="mensaje.error ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-[#D99B6A]/10 text-[#D99B6A] border-[#D99B6A]/30'" 
            class="p-3 border rounded-xl text-sm text-center font-medium"
          >
            {{ mensaje.texto }}
          </div>

          <div class="pt-2">
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full py-3 px-4 bg-[#D99B6A] hover:bg-[#C88A58] active:scale-[0.99] text-black font-bold rounded-xl shadow-lg transition-all duration-200 focus:outline-none disabled:opacity-50"
            >
              {{ loading ? 'Enviando código...' : 'Enviar código de verificación' }}
            </button>
          </div>
        </form>

        <!-- PASO 2: Confirmación mediante código de 6 dígitos -->
        <form v-else class="space-y-5" @submit.prevent="handleConfirmarCodigo">
          <p class="text-sm text-gray-300 text-center">
            Enviamos un código de 6 dígitos a: <br>
            <span class="text-[#D99B6A] font-semibold">{{ form.correo }}</span>
          </p>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5 text-center">Ingresa el código</label>
            <input 
              v-model="codigoInput" 
              type="text" 
              maxlength="6"
              required 
              placeholder="123456"
              class="w-full px-4 py-3 bg-[#181616] border border-[#3D3837] rounded-xl text-white text-center font-mono text-2xl tracking-widest placeholder-gray-600 focus:outline-none focus:border-[#D99B6A] focus:ring-1 focus:ring-[#D99B6A] transition-all"
            />
          </div>

          <div 
            v-if="mensaje.texto" 
            :class="mensaje.error ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-[#D99B6A]/10 text-[#D99B6A] border-[#D99B6A]/30'" 
            class="p-3 border rounded-xl text-sm text-center font-medium"
          >
            {{ mensaje.texto }}
          </div>

          <div class="pt-2 space-y-3">
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full py-3 px-4 bg-[#D99B6A] hover:bg-[#C88A58] active:scale-[0.99] text-black font-bold rounded-xl shadow-lg transition-all duration-200 focus:outline-none disabled:opacity-50"
            >
              {{ loading ? 'Verificando...' : 'Confirmar y Crear Cuenta' }}
            </button>

            <button 
              type="button" 
              @click="paso = 1"
              class="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Modificar correo o datos
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const paso = ref(1)
const form = reactive({
  nombre: '',
  correo: '',
  contrasena: ''
})

const codigoInput = ref('')
const tokenVerificacion = ref('')
const verPassword = ref(false)
const loading = ref(false)
const mensaje = reactive({ texto: '', error: false })

// 1. Enviar solicitud de código
const handleSolicitarCodigo = async () => {
  loading.value = true
  mensaje.texto = ''
  mensaje.error = false

  try {
    const res = await fetch('http://localhost:3000/api/auth/registro/solicitar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || 'Error al solicitar el código')

    tokenVerificacion.value = data.token
    paso.value = 2
    mensaje.texto = ''
  } catch (err) {
    mensaje.error = true
    mensaje.texto = err.message
  } finally {
    loading.value = false
  }
}

// 2. Validar código y registrar
const handleConfirmarCodigo = async () => {
  loading.value = true
  mensaje.texto = ''
  mensaje.error = false

  try {
    const res = await fetch('http://localhost:3000/api/auth/registro/confirmar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: tokenVerificacion.value,
        codigo: codigoInput.value
      })
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || 'Código invalido o caducado')

    mensaje.texto = '¡Correo verificado correctamente! Redirigiendo...'
    
    setTimeout(() => {
      router.push('/login')
    }, 1500)

  } catch (err) {
    mensaje.error = true
    mensaje.texto = err.message
  } finally {
    loading.value = false
  }
}
</script>