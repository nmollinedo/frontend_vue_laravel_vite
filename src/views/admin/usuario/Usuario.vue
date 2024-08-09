<template>
    <h1>Usuario</h1>
    <!--{{ usuarios }}-->
    {{ usuario }}
    <!--{{ errors }}-->
    <div>
        <label for="n">NOMBRE:</label>
        <input type="text" id="n" v-model="usuario.name">
        {{ errors.name }}
        <br>
        <label for="c">CORREO:</label>
        <input type="email" id="c" v-model="usuario.email">
        {{ errors.email }}
        <br>
        <label for="p">CONTRASEÑA:</label>
        <input type="password" id="p" v-model="usuario.password">
        {{ errors.password }}
        <br>
        <button @click="guardarUsuario">Guardar</button>
    </div>

    <table border="1">
        <thead>
            <tr>
                <td>ID</td>
                <td>CORREO</td>
                <td>CREADO EN</td>
                <td>ACCION</td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in usuarios" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.created_at }}</td>
                <td>
                    <button @click="funEditar(user)">EDITAR</button>
                    <button @click="funEliminar(user)">ELIMINAR</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script setup>
// importaciones
import Swal from 'sweetalert2'
import { onMounted, ref } from 'vue';
import usuarioService from '../../../services/usuario.service';

// declarar variables
const usuarios = ref([]);
const usuario = ref({name: "", email: "", password: ""});
const errors = ref({})

// ciclo de vida
onMounted(() => {
    getUsuarios()
})

// funciones metodos

async function getUsuarios(){
    const { data } = await usuarioService.index()

    console.log(data);
    usuarios.value = data;
}

async function guardarUsuario(){
    try {

        if(usuario.value.id){
            await usuarioService.update(usuario.value.id, usuario.value)

            Swal.fire({
                title: "Usuario Actualizado!",
                text: "Para continuar presione OK!",
                icon: "success"
            });
        }else{
            await usuarioService.store(usuario.value);
    
            Swal.fire({
                title: "Usuario Registrado!",
                text: "Para continuar presione OK!",
                icon: "success"
            });

        }
    
        getUsuarios()
        
    } catch (error) {
        errors.value = error.response.data.errors
        // alert("Error al registrar el usuario")
    }
}

function funEditar(user){
    usuario.value = user;
}

async function funEliminar(user){
    if(confirm("Está seguro de elimninar al usuario?")){
        await usuarioService.destroy(user.id);
        getUsuarios()

    }

}
</script>