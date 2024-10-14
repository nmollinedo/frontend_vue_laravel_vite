<template>
  <!--
  <RouterLink to="/">INICIO</RouterLink> |
  <RouterLink to="/servicios">SERVICIOS</RouterLink> |-->
  <RouterLink to="/login">INGRESAR</RouterLink>

  
  <router-view></router-view>
  
</template>
<script setup>
// Importa el archivo CSS personalizado
import './assets/custom-theme.css';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import authService from './../src/services/auth.service'; // Servicio para gestionar la autenticación

const timeout = ref(null);
const idleTime = ref(0); // Tiempo de inactividad en minutos
const maxIdleTime = 30; // Tiempo máximo de inactividad (30 minutos)
const router = useRouter(); // Para redirigir al usuario

// Resetea el temporizador de inactividad cuando el usuario interactúa con la aplicación
const resetIdleTimer = () => {
  idleTime.value = 0;
  clearTimeout(timeout.value);
  startIdleTimer(); // Reinicia el temporizador
};

// Inicia el temporizador de inactividad
const startIdleTimer = () => {
  timeout.value = setTimeout(() => {
    idleTime.value += 1;
    if (idleTime.value >= maxIdleTime) {
      // Cerrar sesión cuando el tiempo máximo de inactividad se supera
      logout();
    } else {
      startIdleTimer(); // Continuar el temporizador
    }
  }, 60000); // Cada minuto (60,000 ms)
};

// Función para cerrar sesión y redirigir a la página de login
const logout = async () => {
  await authService.salir(); // Llama al servicio de autenticación para cerrar sesión
  localStorage.clear(); // Limpia el almacenamiento local
  router.push('/login'); // Redirige al usuario a la página de login
};

// Agregar los eventos del temporizador al montar el componente
onMounted(() => {
  window.addEventListener('mousemove', resetIdleTimer); // Evento cuando se mueve el mouse
  window.addEventListener('keydown', resetIdleTimer); // Evento cuando se presiona una tecla
  startIdleTimer(); // Inicia el temporizador de inactividad
});

// Remover los eventos al desmontar el componente
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', resetIdleTimer);
  window.removeEventListener('keydown', resetIdleTimer);
  clearTimeout(timeout.value); // Limpia el timeout
});

</script>