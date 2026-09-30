<template>
  <div class="min-h-screen bg-[#181616] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
    
    <!-- Resplandor decorativo de fondo -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-[#D99B6A]/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-[#D99B6A]/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Encabezado / Logo -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
      <h1 class="text-4xl font-extrabold tracking-wider mb-2">
        Shopware<span class="text-[#D99B6A]">©</span>
      </h1>
      <h2 class="text-lg font-medium text-gray-300">
        Bienvenido de nuevo
      </h2>
      <p class="mt-2 text-sm text-gray-400">
        ¿Aún no tienes cuenta?
        <router-link to="/registro" class="font-semibold text-[#D99B6A] hover:underline transition-all ml-1">
          Regístrate
        </router-link>
      </p>
    </div>

    <!-- Tarjeta del Formulario -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
      <div class="bg-[#211F1F]/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-[#332F2E]">
        
        <form class="space-y-5" @submit.prevent="handleLogin">
          
          <!-- Correo -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Correo electrónico</label>
            <input 
              v-model="form.correo" 
              type="email" 
              required 
              placeholder="correo@ejemplo.com"
              class="w-full px-4 py-3 bg-[#181616] border border-[#3D3837] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D99B6A] focus:ring-1 focus:ring-[#D99B6A] focus:shadow-[0_0_15px_rgba(217,155,106,0.2)] transition-all text-sm"
            />
          </div>

          <!-- Contraseña -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
            <div class="relative">
              <input 
                v-model="form.contrasena" 
                :type="verPassword ? 'text' : 'password'" 
                required 
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-[#181616] border border-[#3D3837] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D99B6A] focus:ring-1 focus:ring-[#D99B6A] focus:shadow-[0_0_15px_rgba(217,155,106,0.2)] transition-all text-sm pr-10"
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

          <!-- Mensaje Feedback -->
          <div 
            v-if="mensaje.texto" 
            :class="mensaje.error ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-[#D99B6A]/10 text-[#D99B6A] border-[#D99B6A]/30'" 
            class="p-3 border rounded-xl text-sm text-center font-medium"
          >
            {{ mensaje.texto }}
          </div>

          <!-- Botón de Inicio de Sesión -->
          <div class="pt-2">
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full py-3 px-4 bg-[#D99B6A] hover:bg-[#C88A58] active:scale-[0.99] text-black font-bold rounded-xl shadow-lg transition-all duration-200 focus:outline-none disabled:opacity-50"
            >
              {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
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

const form = reactive({
  correo: '',
  contrasena: ''
})

const verPassword = ref(false)
const loading = ref(false)
const mensaje = reactive({ texto: '', error: false })

const handleLogin = async () => {
  loading.value = true;
  mensaje.texto = '';
  mensaje.error = false;

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correo: form.correo,
        contrasena: form.contrasena
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    // Guardar token JWT y datos en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    mensaje.error = false;
    mensaje.texto = '¡Inicio de sesión exitoso!';

    setTimeout(() => {
      // Redirigir según el idRol
      if (data.usuario.idRol === 2) {
        router.push('/admin/dashboard'); // Redirige al Dashboard de Admin
      } else {
        router.push('/tienda'); // Redirige al catálogo de clientes
      }
    }, 800);

  } catch (error) {
    mensaje.error = true;
    mensaje.texto = error.message;
  } finally {
    loading.value = false;
  }
};
</script>