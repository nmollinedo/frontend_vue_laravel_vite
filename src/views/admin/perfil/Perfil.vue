<template>
    <div class="card">

                <div class="max-w-4xl flex items-center flex-wrap mx-auto my-32 lg:my-0">
                    <div>
                        <h1>Perfil del Usuario</h1>
                    <p><strong>Nombre:</strong> {{ perfil.name }}</p>
                    <p><strong>Email:</strong> {{ perfil.email }}</p>
                    <p><strong>Fecha de creación:</strong> {{ moment(perfil.created_at).format('DD/MM/YYYY HH:mm') }}</p>
                    </div>
                    

                    
                    <!-- Comprobamos si la entidad está definida -->
                    <div v-if="perfil.entidad">
                        <h2>Entidad</h2>
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
                <div class="pt-12 pb-8">
                <button
                    class="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full"
                    @click="salir()"
                >
                    Cerrar Sesion (Salir)
                </button>
                </div>

    
                

        

    </div>
</template>

<script setup>
    import { onMounted, ref } from "vue";
    import authService from "./../../../services/auth.service"
import { useRoute } from "vue-router";
import moment from 'moment'


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
    
    async function salir() { 
    try {
        const { data } = await authService.salir();
        localStorage.removeItem("access_token");
        router.push({ name: 'Login' }).then(() => {
            window.location.reload(); // Forzar recarga de página
        });
    } catch (error) {
        console.error("Error during logout:", error);
        alert("Error while logging out, please try again.");
    }
}
</script>