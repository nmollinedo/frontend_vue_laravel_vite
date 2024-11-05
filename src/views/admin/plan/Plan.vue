<!--<template>
   <div>
      <Button label="Nuevo Plan o Programa" @click="abrirNuevo" />

      <DataTable :value="planesProgramas" paginator rows="10">
          <Column field="tipo_clasificador" header="Tipo Clasificación"></Column>
          <Column field="clasificador" header="Clasificador"></Column>
          <Column field="descripcion" header="Descripción"></Column>
          
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
</style>-->

<template>
  <div>
    <h2>Relación Plan-Programa</h2>

    <!-- Plan Dropdown -->
    <Dropdown v-model="selectedPlan" :options="plans" optionLabel="name" placeholder="Seleccione un Plan" />

    <!-- Program Selection -->
    <DataTable v-if="selectedPlan" :value="programas" selectionMode="multiple" v-model:selection="selectedProgramas">
      <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
      <Column field="name" header="Programa"></Column>
      <Column field="description" header="Descripción"></Column>
      <Column field="status" header="Vigencia"></Column>
    </DataTable>

    <!-- CRUD Actions -->
    <div>
      <Button label="Guardar Relación" icon="pi pi-save" @click="saveRelation" />
      <Button label="Actualizar Relación" icon="pi pi-refresh" @click="updateRelation" />
      <Button label="Eliminar Relación" icon="pi pi-trash" @click="deleteRelation" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import planService from '../../../services/plan.service';
import programaService from '../../../services/programa.service';



const plans = ref([]);
const programas = ref([]);
const selectedPlan = ref(null);
const selectedProgramas = ref([]);

//const planService = new PlanService();
//const programaService = new ProgramaService();
//const relacionService = new RelacionService();

onMounted(async () => {
  plans.value = await planService.index();
  programas.value = await programaService.index();
});

const saveRelation = async () => {
  try {
    await relacionService.saveRelacion(selectedPlan.value, selectedProgramas.value);
    alert('Relación guardada exitosamente');
  } catch (error) {
    console.error('Error al guardar la relación:', error);
  }
};

const updateRelation = async () => {
  try {
    await relacionService.updateRelacion(selectedPlan.value, selectedProgramas.value);
    alert('Relación actualizada exitosamente');
  } catch (error) {
    console.error('Error al actualizar la relación:', error);
  }
};

const deleteRelation = async () => {
  try {
    await relacionService.deleteRelacion(selectedPlan.value);
    alert('Relación eliminada exitosamente');
    selectedProgramas.value = [];
  } catch (error) {
    console.error('Error al eliminar la relación:', error);
  }
};
</script>

<style>
/* Add your custom styles here */
</style>