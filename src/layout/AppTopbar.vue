<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <span>TPP</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
        <!--        <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div> -->
            </div>

           <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button> 
            <!-- Sección para seleccionar la entidad y el código presupuestario -->
           <div v-if="userRole === 'ADM'">
                    <h1>Entidad seleccionada: {{ entidadId }}</h1>{{userRole}}
                    <Dropdown 
                        v-model="entidadId" 
                        :options="entidades" 
                        optionLabel="nombre" 
                        optionValue="id" 
                        placeholder="Selecciona una entidad"
                        @change="updateEntidadId"
                    />
                    
                    <p>Código presupuestario: {{ codigoPresupuestario }}</p>
                </div>
            
            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" @click="toggleProfileMenu">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>

                
                
                <!-- Mostrar perfil del usuario -->
                <div v-if="showProfileMenu" class="profile-menu">
                    <div class="profile-details">
                        <p><strong>Nombre:</strong> {{ perfil.name }}</p>
                        <p><strong>Email:</strong> {{ perfil.email }}</p>
                        <p><strong>Entidad:</strong> {{ perfil.entidad.id }}</p>
                        <p><strong>Sigla:</strong> {{ perfil.entidad.sigla }}</p>
                        <p><strong>Nombre de la Entidad:</strong> {{ perfil.entidad.entidad }}</p>
                        <p><strong>Codigo presupuestario:</strong> {{ perfil.entidad.codigo_presupuestario }}</p>
                        <p><strong>Rol:</strong> {{ perfil.rol.rol }}</p>
                    </div>
                    <button class="logout-button" @click="salir">Cerrar Sesión</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import AppConfigurator from './AppConfigurator.vue';
import { ref, computed, onMounted, watch } from 'vue';
import authService from "../services/auth.service";
import entidadService from '../services/entidad.service';
import { useRoute } from 'vue-router';
import { store } from '../store/store';  // Importa el store

// Estado del perfil
const perfil = ref({});
const entidades = ref([]);
const selectedEntidad = ref(null);
const selectedCodigoPresupuestario = ref(null);

// Importar funciones del layout
const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();

// Estado del menú de perfil
const showProfileMenu = ref(false);
const router = useRoute();

// Computed para el entidad_id y codigo_presupuestario desde el store
const entidadId = computed({
  get: () => store.entidad_id,
  set: (value) => store.setEntidadId(value)
});

const codigoPresupuestario = ref(null);  // Código presupuestario reactivo
/*
const codigoPresupuestarioId = computed({
  get: () => store.codigo_presupuestario,
  set: (value) => store.setCodigoPresupuestario(value)
});*/
const userRole = ref(localStorage.getItem('rol')); // Cambia esto a 'USER' para probar si es diferente
// Función para actualizar el ID de la entidad y almacenarlo en localStorage
function updateEntidadId() {
  console.log("Id entidad", entidadId.value);
  store.setEntidadId(entidadId.value);
  // Buscar la entidad seleccionada para obtener el código presupuestario
  const selectedEntidad = entidades.value.find(entidad => entidad.id === entidadId.value);
  if (selectedEntidad) {
    codigoPresupuestario.value = selectedEntidad.codigo_presupuestario;  // Extrae el código presupuestario
    localStorage.setItem('codigo_presupuestario', selectedEntidad.codigo_presupuestario);  // Almacenar en localStorage
  }

  // Almacenar el entidad_id en localStorage
  localStorage.setItem('entidad_id', entidadId.value);
}

// Función para cargar entidades
const getEntidades = async () => {
  const { data } = await entidadService.index();
  entidades.value = data;
  console.log("Lista entidad", entidades);
};

// Función para obtener el perfil del usuario
async function obtenerPerfil() {
  try {
    const { data } = await authService.perfil();
    perfil.value = data;
    // Guarda el rol en el localStorage
    localStorage.setItem('rol', perfil.value.rol.rol);
    localStorage.setItem('entidad_id', perfil.value.entidad_id);

    // Actualiza el valor reactivo de userRole después de obtener el perfil
    userRole.value = perfil.value.rol.rol;
    console.log("Rol actualizado:", userRole.value);

    // Actualiza las entidades si es necesario
    await getEntidades();
  } catch (error) {
    alert("Error al recuperar los datos de perfil");
  }
}

// Función para cerrar sesión
async function salir() {
  try {
    const { data } = await authService.salir();
    localStorage.removeItem("access_token");
    router.push({ name: 'Login' });
  } catch {
    alert("Error al cerrar sesión");
  }
}

// Mostrar u ocultar el menú de perfil
function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value;
}

// Cargar perfil y entidades al montar el componente
onMounted(() => {
  obtenerPerfil();
  getEntidades();
  const storedEntidadId = localStorage.getItem('entidad_id');
  if (storedEntidadId) {
        entidadId.value = parseInt(storedEntidadId);  // Asegúrate de convertir a número si es necesario
        //updateCodigoPresupuestario(entidadId.value);  // Actualizar código presupuestario
    }
});

// Actualizar el valor de localStorage cuando cambie selectedEntidad o selectedCodigoPresupuestario
watch(entidadId, (newEntidad) => {
  if (newEntidad) {
    localStorage.setItem('entidad_id', newEntidad);  // Almacenar el ID en localStorage
  }
});


</script>

<style scoped>
.profile-menu {
    background-color: #125686;
    border: 1px solid #ddd;
    padding: 1rem;
    position: absolute;
    right: 0;
    top: 3rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.profile-details {
    margin-bottom: 1rem;
}

.logout-button {
    background-color: #f44336;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    cursor: pointer;
    border-radius: 0.25rem;
    width: 100%;
}

.logout-button:hover {
    background-color: #d32f2f;
}
</style>