<template>
    <div class="card">
        <DataTable :value="personas" tableStyle="min-width: 50rem">
            <Column field="id" header="COD"></Column>
            <Column field="nombres" header="NOMBRES"></Column>
            <Column field="apellidos" header="APELLIDOS"></Column>
            <Column field="fecha_nac" header="FECHA NAC"></Column>

            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button v-if="!slotProps.data.user" icon="pi pi-user-edit" rounded class="mr-2" @click="mostrarDatosPersonales(slotProps.data)" />
                    <Button v-else icon="pi pi-user-edit" rounded outlined class="mr-2" @click="mostrarDatosPersonales(slotProps.data)" />

                    <Button icon="pi pi-pencil" rounded class="mr-2" @click="funEditar(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="funEliminar(slotProps.data)" />
                </template>
            </Column>
                
        </DataTable>
    </div>
</template>
<script setup>

import { onMounted, ref } from "vue"
import personaService from "./../../../services/persona.service"

const personas = ref([])

onMounted(() => {
    getPersonas()
})

const getPersonas = async () => {
    const {data} = await personaService.index();
    personas.value = data
}

</script>