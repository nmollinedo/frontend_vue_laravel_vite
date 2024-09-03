<template>
    <div class="card">

        <h5>NOMBRE: {{ perfil.name }}</h5>

        

        <h5>CORREO: {{ perfil.email }}</h5>

        <h5>CREADO EN: {{ perfil.created_at }}</h5>

    
        <button @click="salir()">Salir</button>

        

    </div>
</template>

<script setup>
    import { onMounted, ref } from "vue";
    import authService from "./../../../services/auth.service"
import { useRoute } from "vue-router";

    const router = useRoute()

    const perfil = ref({});
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