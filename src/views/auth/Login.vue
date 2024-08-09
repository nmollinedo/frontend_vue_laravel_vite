<template>
    <br>
    <pre>{{ usuario }}</pre>
    
    <h1>LOGIN</h1>
    <form @submit.prevent="funIngresar()">
        <label for="e">INGRESE SU CORREO</label>
        <input type="email" id="e" required v-model="usuario.email">
        {{ errors.email }}
        <br>
        <label for="pass">INGRESE SU CONTRASEÑA</label>
        <input type="password" id="pass" required v-model="usuario.password">
        {{ errors.password }}
        <br>
        <input type="submit" value="Ingresar">
        <a href="">¿Olvidaste tu Contraseña?</a>
    </form>
</template>

<script setup>
// import axios from "axios"
import authService from "./../../services/auth.service"
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter();

const usuario = ref({email: "", password: ""})
const errors = ref({})

async function funIngresar(){

    try {
        const {data} = await authService.login(usuario.value)
        console.log(data.access_token);
        localStorage.setItem("access_token", data.access_token);
    
        router.push("/admin/perfil");
        // const {data} = await axios.post("http://127.0.0.1:8000/api/v1/auth/login", usuario.value);
        // console.log(data);
        
    } catch (error) {
        console.log(error.response.data);
        if(error.response.data.errors){
            errors.value = error.response.data.errors
        }else{
            alert("Credenciales Incorrectas")
        }
    }
}

</script>