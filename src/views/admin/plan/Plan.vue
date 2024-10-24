<template>
  <div>
      <Button label="Nuevo Plan o Programa" @click="openNew" />

      <DataTable :value="planesProgramas" paginator rows="10">
          <Column field="tipo_clasificador" header="Tipo Clasificación"></Column>
          <Column field="clasificador" header="Clasificador"></Column>
          <Column field="descripcion" header="Descripción"></Column>
          <Column header="Acciones" body="actionTemplate"></Column>
      </DataTable>

      <Dialog v-model:visible="dialogVisible" header="Nuevo Plan o Programa" :style="{ width: '50vw' }">
          <form @submit.prevent="save">
              <div>
                  <InputText v-model="planPrograma.tipo_clasificacion" placeholder="Tipo Clasificador" :style="{ width: '45vw' }"/>
              </div>
              <div>
                  <InputText v-model="planPrograma.clasificador" placeholder="Nombre Clasificador" :style="{ width: '45vw' }"/>
              </div>
              <div>
                  <InputText v-model="planPrograma.descripcion" placeholder="Descripción" :style="{ width: '45vw' }"/>
              </div>
              <Button label="Guardar" type="submit" />
          </form>
      </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

import programaService from "../../../services/programa.service";

// Definir los estados reactivos
const planesProgramas = ref([]);
const planPrograma = ref({ tipo_clasificacion: '', clasificador: '', descripcion: '' });
const dialogVisible = ref(false);

// Función para abrir el formulario de nuevo plan o programa
const openNew = () => {
  planPrograma.value = { tipo_clasificacion: '', clasificador: '', descripcion: '' };
  dialogVisible.value = true;
};

// Función para guardar un nuevo plan o programa
const save = () => {
  axios.post('/planes-programas', planPrograma.value)
      .then(response => {
          loadData();
          dialogVisible.value = false;
      })
      .catch(error => {
          console.error('Error al guardar el plan/programa:', error);
      });
};

// Función para cargar los datos de planes y programas
//const loadData = () => {
  const listarPlanPrograma = async () => {
  try {
    const { data } = await programaService.listarPlanPrograma();
    planesProgramas.value = data;
  } catch (error) {
    console.error("Error al cargar los departamentos:", error);
  }
};

// Ejecutar cuando se monta el componente
onMounted(() => {
  //loadData();
  listarPlanPrograma();
});
</script>

<style scoped>
/* Estilos personalizados si los necesitas */
</style>