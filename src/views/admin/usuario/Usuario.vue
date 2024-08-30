<template>
    <div class="card">
        <h1>Usuario</h1>
        <!--{{ usuarios }}-->
        <!--{{ usuario }}-->
        <!--{{ errors }}-->
    <!--    <div>
            <label for="n">NOMBRE:</label>
            <InputText id="n" v-model.trim="usuario.name" required="true" autofocus />
            {{ errors.name }}
            <br>
            <label for="c">CORREO:</label>
            <InputText type="email" id="c" v-model="usuario.email" />
            {{ errors.email }}
            <br>
            <label for="p">CONTRASEÑA:</label>
            <InputText type="password" id="p" v-model="usuario.password" />
            {{ errors.password }}
            <br>
            <button @click="guardarUsuario">{{ usuario.id?'Modificar':'Guardar'}}</button>
            <button @click="cancelarRegistro">Cancelar</button>
        </div>
    
        -->

        <DataTable :value="usuarios" tableStyle="min-width: 50rem">
            <Column field="id" header="COD"></Column>
            <Column field="email" header="CORREO"></Column>
            <Column field="created_at" header="CREADO EN"></Column>

            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button v-if="!slotProps.data.persona" icon="pi pi-user-edit" rounded class="mr-2" @click="mostrarDatosPersonales(slotProps.data)" />
                    <Button v-else icon="pi pi-user-edit" rounded outlined class="mr-2" @click="mostrarDatosPersonales(slotProps.data)" />

                    <Button icon="pi pi-pencil" rounded class="mr-2" @click="funEditar(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="funEliminar(slotProps.data)" />
                </template>
            </Column>
                
        </DataTable>
<!--
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
        </table>  -->

    </div>

    <Dialog v-model:visible="visibleDialogPersona" modal header="Actualizar Datos Personales" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Actualizar datos Personales.</span>
        <div class="flex items-center gap-4 mb-4">
            <label for="username" class="font-semibold w-24">Nombres</label>
            <InputText id="username" class="flex-auto" autocomplete="off" v-model="persona.nombres" />
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="ap" class="font-semibold w-24">Apellidos</label>
            <InputText id="ap" class="flex-auto" autocomplete="off" v-model="persona.apellidos" />
        </div>

        <div class="flex items-center gap-4 mb-4">
            <label for="fn" class="font-semibold w-24">fecha_nac</label>
            <InputText type="date" id="fn" class="flex-auto" autocomplete="off" v-model="persona.fecha_nac" />
        </div>
        
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancelar" severity="secondary" @click="visibleDialogPersona = false"></Button>
            <Button type="button" label="Guardar" @click="asignarDatosPersonales()"></Button>
        </div>
    </Dialog>
</template>
<script setup>
// importaciones
// import Swal from 'sweetalert2'
import { onMounted, ref } from 'vue';
import usuarioService from '../../../services/usuario.service';

// declarar variables
const usuarios = ref([]);
const usuario = ref({name: "", email: "", password: ""});
const errors = ref({})
const visibleDialogPersona = ref(false)
const usuario_id = ref(-1);

const persona = ref({nombres: "", apellidos: "", fecha_nac: "" })

// ciclo de vida
onMounted(() => {
    getUsuarios()
})

// funciones metodos

async function getUsuarios(){
    try {
        const { data } = await usuarioService.index()
    
        console.log(data);
        usuarios.value = data;

    }catch(error){
        
        if(error.response.status == 404){
            alert("La Pagina buscada no existe");

        }
        console.log(error);
    }
}

async function guardarUsuario(){
    try {

        if(usuario.value.id){
            await usuarioService.update(usuario.value.id, usuario.value)

            // Swal.fire({
            //     title: "Usuario Actualizado!",
            //     text: "Para continuar presione OK!",
            //     icon: "success"
            // });
        }else{
            await usuarioService.store(usuario.value);
    
            // Swal.fire({
            //     title: "Usuario Registrado!",
            //     text: "Para continuar presione OK!",
            //     icon: "success"
            // });

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

function cancelarRegistro(){
    usuario.value = {name: "", email: "", password: ""};
}

function mostrarDatosPersonales(user){
    persona.value = {}
    visibleDialogPersona.value = true
    usuario_id.value = user.id; 
    if(user.persona){
        persona.value = user.persona
    }
}

async function asignarDatosPersonales(){

    try {
        persona.value.user_id = usuario_id.value
        console.log(persona.value);
    
        await usuarioService.asignarPersona(persona.value);

        visibleDialogPersona.value = false;
        getUsuarios()
        
    } catch (error) {
        alert("Error al asignar datos al usuario")
    }
}
</script>