<template>
   <div>
      <Button label="Nuevo Plan o Programa" @click="abrirNuevo" />

      <DataTable :value="planesProgramas" paginator rows="10">
          <Column field="tipo_clasificador" header="Tipo Clasificación"></Column>
          <Column field="clasificador" header="Clasificador"></Column>
          <Column field="descripcion" header="Descripción"></Column>
           <!-- Columna de Acciones con botones de editar y eliminar -->
    <Column header="Acciones" :exportable="false" style="min-width: 12rem">
        <template #body="slotProps">
            <Button 
                icon="pi pi-pencil" 
                class="p-button-text p-button-rounded p-button-info" 
                @click="editarPlanPrograma(slotProps.data)" 
            />
            <Button 
                icon="pi pi-trash" 
                class="p-button-text p-button-rounded p-button-danger" 
                @click="eliminarPlanPrograma(slotProps.data.id)" 
            />
        </template>
    </Column>
      </DataTable>

      <!-- Dialog para nuevo o editar plan o programa -->
      <Dialog v-model:visible="dialogVisible" :header="isEditing ? 'Editar Plan o Programa' : 'Nuevo Plan o Programa'" :style="{ width: '50vw' }">
          <form @submit.prevent="guardarPlanPrograma">
              <div>
                  <label for="Clasificador" class="block font-bold mb-3">Tipo Clasificador</label>
                  <Dropdown 
                      v-model="selectedClasificador" 
                      :options="clasificadores" 
                      optionLabel="tipo_clasificador"
                      placeholder="Seleccione clasificador" 
                      class="w-full md:w-14rem" 
                  />
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
import planService from '../../../services/plan.service';

// Estados reactivos
const planesProgramas = ref([]);
const clasificadores = ref([]);
const selectedClasificador = ref({ id: null });
const planPrograma = ref({ tipo_clasificacion: '', clasificador: '', descripcion: '' });
const dialogVisible = ref(false);
const isEditing = ref(false); // Nuevo estado para identificar si es edición

// Función para abrir el formulario de nuevo plan o programa
const abrirNuevo = () => {
  planPrograma.value = { tipo_clasificacion: '', clasificador: '', descripcion: '' };
  selectedClasificador.value = { id: null };
  isEditing.value = false; // No es edición
  dialogVisible.value = true;
};

// Función para guardar o actualizar un plan o programa
const guardarPlanPrograma = async () => {
  const payload = {
    clasificador: planPrograma.value.clasificador,
    descripcion: planPrograma.value.descripcion,
    tipo_clasificador_id: selectedClasificador.value.id
  };
  
  try {
    if (isEditing.value) {
      await programaService.modificarPlanPrograma(planPrograma.value.id, payload);
    } else {
      await programaService.guardarPlanPrograma(payload);
    }
    dialogVisible.value = false;
    listarPlanPrograma(); // Actualizar lista
  } catch (error) {
    console.error("Error al guardar el plan o programa:", error);
  }
};

// Función para editar un plan o programa
const editarPlanPrograma = (programa) => {
  planPrograma.value = { ...programa }; // Cargar los datos en el formulario
  selectedClasificador.value = clasificadores.value.find(clasificador => clasificador.id === programa.tipo_clasificador_id) || { id: null };
  isEditing.value = true;
  dialogVisible.value = true;
};

// Función para eliminar un plan o programa
const eliminarPlanPrograma = async (id) => {
  if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
    try {
      await programaService.eliminarPlanPrograma(id);
      listarPlanPrograma(); // Actualizar lista
    } catch (error) {
      console.error("Error al eliminar el plan o programa:", error);
    }
  }
};

// Funciones para cargar datos
const listarPlanPrograma = async () => {
  try {
    const { data } = await programaService.listarPlanPrograma();
    planesProgramas.value = data;
  } catch (error) {
    console.error("Error al cargar los planes y programas:", error);
  }
};

const listarClasificador = async () => {
  try {
    const { data } = await planService.listarClasificador();
    clasificadores.value = data;
  } catch (error) {
    console.error("Error al cargar los clasificadores:", error);
  }
};

// Ejecutar cuando se monta el componente
onMounted(() => {
  listarPlanPrograma();
  listarClasificador();
});


</script>

<style scoped>
/* Estilos personalizados si los necesitas */
</style>