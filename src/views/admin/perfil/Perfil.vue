<template>
    <div class="card">

        <div>
    <h1>Perfil del Usuario</h1>
    <p><strong>Nombre:</strong> {{ perfil.name }}</p>
    <p><strong>Email:</strong> {{ perfil.email }}</p>
    <p><strong>Fecha de creación:</strong> {{ perfil.created_at }}</p>

    <h2>Entidad</h2>
      <!-- Comprobamos si la entidad está definida -->
      <div v-if="perfil.entidad">
        <p><strong>Código de Entidad:</strong> {{ perfil.entidad.id }}</p>
        <p><strong>Sigla:</strong> {{ perfil.entidad.sigla }}</p>
        <p><strong>Nombre de la Entidad:</strong> {{ perfil.entidad.entidad }}</p>
        <p><strong>Codigo presupuestario:</strong> {{ perfil.entidad.codigo_presupuestario }}</p>
      </div>
      <!-- Si no hay entidad, mostramos un mensaje o dejamos vacío -->
      <div v-else>
        <p>No hay información de entidad disponible.</p>
      </div>
  </div>
  

    
        <button @click="salir()">Salir</button>

        

    </div>
</template>

<script setup>
    import { onMounted, ref } from "vue";
    import authService from "./../../../services/auth.service"
import { useRoute } from "vue-router";

    const router = useRoute()

    const perfil = ref({});
    const entidad = ref({});
    const persona = ref({});

    onMounted(() => {
        obtenerPerfil()
        //recorrerArray()
    })

 //   function recorrerArray(data) {
//    for (let i = 0; i < data.length; i++){
//        console.log(data[i]);
//    }
//}
    async function obtenerPerfil(){
        try {
            const {data} = await authService.perfil()
            console.log("perfil",data);
            perfil.value = data;
            //console.log("entro::"+perfil.persona[1]);
            //persona = perfil.persona
            
            
        } catch (error) {
            alert("Error al recuperar los datos de perfil")
        }
    }
    
    async function salir(){
        try{
            const {data} = await authService.salir();
            localStorage.removeItem("access_token");
            router.push({name: 'Login'});

        } catch{

        }
    }
</script>