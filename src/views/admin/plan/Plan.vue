<template>
  <div>

    <basic-tabs class="" style="width: 100%; height: 100%; color: black;">
      <basic-tab title="Plan - Programa" style="margin-top: 20px; margin-bottom: 0px; ">
        <Button label="Nuevo Plan o Programa" @click="abrirNuevo" />
        <DataTable :value="planesProgramas" paginator rows="10">
          <Column field="tipo_clasificador" header="Tipo Clasificación"></Column>
          <Column field="clasificador" header="Clasificador"></Column>
          <Column field="descripcion" header="Descripción"></Column>

          <Column header="Acciones" :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="p-button-text p-button-rounded p-button-info"
                @click="editarPlanPrograma(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-text p-button-rounded p-button-danger"
                @click="eliminarPlanPrograma(slotProps.data.id)" />
            </template>
          </Column>
        </DataTable>
      </basic-tab>
      <basic-tab title="Relación Plan - Programa">

        <DataTable :value="planes" paginator rows="10" @row-click="onRowClick">
          <Column field="tipo_clasificador" header="Tipo Clasificación"></Column>
          <Column field="clasificador" header="Plan"></Column>
          <Column field="descripcion" header="Descripción"></Column>
        </DataTable>

        <Button v-if="mostrar2daTabla" 
            label="Adicionar" 
            icon="pi pi-plus" 
            @click="adicionarComponente"
            style="background-color: #1e88e5; border-color: #1e88e5; color: #fff;" />

        <DataTable v-if="mostrar2daTabla"  :value="programasPlan" paginator rows="10"> 
          <Column field="clasificador" header="Programa">
            <template #body="slotProps">
              <Dropdown v-if="slotProps.data.nuevo" v-model="componenteSelecionado" :options="programasData"
                optionLabel="clasificador" placeholder="Seleccione programa" class="custom-dropdown"
                :disabled="!slotProps.data.nuevo" />
              <span v-else>{{ slotProps.data.clasificador }}</span>
            </template>
          </Column>

          <Column field="descripcion" header="Descripción"></Column>
          <Column header="Vigencia">
            <template #body="slotProps">
              <span v-if="slotProps.data.nuevo"></span>
              <span v-else>Vigente</span>
            </template>
          </Column>

          <Column header="Acciones" :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
              <Button v-if="!slotProps.data.nuevo" icon="pi pi-trash"
                class="p-button-text p-button-rounded p-button-danger"
                @click="eliminarPlanPrograma(slotProps.data.id)" />
              <Button v-if="slotProps.data.nuevo" icon="pi pi-save"
                class="p-button-rounded p-button-success p-button-text" @click="guardarProgramaPlan(slotProps.data)" />
              <Button v-if="slotProps.data.nuevo" icon="pi pi-times"
                class="p-button-rounded p-button-danger p-button-text" @click="cerrarEdicion(slotProps.data, index)" />

            </template>
          </Column>
        </DataTable>

      </basic-tab>
    </basic-tabs>

    <Dialog v-model:visible="dialogVisible" :header="isEditing ? 'Editar Plan o Programa' : 'Nuevo Plan o Programa'"
      :style="{ width: '50vw' }">
      <form @submit.prevent="guardarPlanPrograma">
        <div>
          <label for="Clasificador" class="block font-bold mb-3">Tipo Clasificador</label>
          <Dropdown v-model="selectedClasificador" :options="clasificadores" optionLabel="tipo_clasificador"
            placeholder="Seleccione clasificador" class="w-full md:w-14rem" />
        </div>
        <div>
          <InputText v-model="planPrograma.clasificador" placeholder="Nombre Clasificador" :style="{ width: '45vw' }" />
        </div>
        <div>
          <InputText v-model="planPrograma.descripcion" placeholder="Descripción" :style="{ width: '45vw' }" />
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
import BasicTab from "./../../../components/Tab.vue";
import BasicTabs from "./../../../components/Tabs.vue";
import programaService from "../../../services/programa.service";
import planService from '../../../services/plan.service';
import { useToast } from 'primevue/usetoast';

// Estados reactivos
const toast = useToast();
const planesProgramas = ref([]);
const clasificadores = ref([]);
const planes = ref([]);
const programasPlan = ref([]);
const programasData = ref([]);
const selectedOption = ref(null);  // Opción seleccionada en el ComboBox
const componenteSelecionado = ref({ id: null });
const esAbiertoComponente = ref(false);

const selectedClasificador = ref({ id: null });
const planPrograma = ref({ tipo_clasificacion: '', clasificador: '', descripcion: '' });
const dialogVisible = ref(false);
const isEditing = ref(false); // Nuevo estado para identificar si es edición
const planId = ref({ id: null });
const mostrar2daTabla = ref(false);
// Función para abrir el formulario de nuevo plan o programa
const abrirNuevo = () => {
  planPrograma.value = { tipo_clasificacion: '', clasificador: '', descripcion: '' };
  selectedClasificador.value = { id: null };
  isEditing.value = false; // No es edición
  dialogVisible.value = true;
};

const cerrarEdicion = (rowData, index) => {
  esAbiertoComponente.value = false;
  programasPlan.value.splice(index, 1)
};

// Función para manejar el clic en una fila de la primera tabla
const onRowClick = async (event) => {
  planId.id = event.data.id;
  esAbiertoComponente.value = false;
  mostrar2daTabla.value = true;
  // Realizar la petición para obtener los detalles del plan seleccionado
  obtieneProgramaPorIdPlan(event.data.id);
};

const obtieneProgramaPorIdPlan = async (id) => {
  try {
    const response = await programaService.listarRelPlanPrograma(id)
    programasPlan.value = response.data;
  } catch (error) {
    console.error('Error al obtener los detalles del plan:', error);
  }
};

const guardarProgramaPlan = async (filaData) => {
    const selectedComponenteId = componenteSelecionado.value.id;
    console.log("filaData",componenteSelecionado)
    console.log("progrmaa seleccionado ID",selectedComponenteId)
    console.log("plan  ID",planId.id)
    if(!selectedComponenteId){
      toast.add({ severity: 'error', summary: 'Error', detail: 'Seleccione un programa', life: 3000 });
      return;
    }
    try {
      esAbiertoComponente.value = false;
      const payload = {
        clasificador_plan: selectedComponenteId,
        clasificador_programa: planId.id,
      };
      console.log("envio Programa Plan",payload);
      const { data } = await programaService.guardarPlanesProgramas(payload);
      obtieneProgramaPorIdPlan(planId.id);
      toast.add({ severity: 'success', summary: 'Guardar', detail: 'Se guardo correctamente', life: 3000 });
    } catch (err) {
      console.log("error guardar programa en form",err);
    }
};


const adicionarComponente = () => {
  componenteSelecionado.value = {};
  if (!esAbiertoComponente.value) {
    esAbiertoComponente.value = true;
    programasPlan.value.unshift({
      nuevo: true
    })
  }
}
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


const guardarPlanesProgramas = async () => {
  const payload = {
    clasificador_plan: componenteSelecionado.value.id,
    clasificador_programa: componenteSelecionado.value.id,
  
  };

  try {
    if (isEditing.value) {
      await programaService.guardarPlanesProgramas(payload);
    } else {
      await programaService.guardarPlanesProgramas(payload);
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

const listarPlanes = async () => {
  try {
    const { data } = await planService.index();
    planes.value = data;
  } catch (error) {
    console.error("Error al cargar los planes:", error);
  }
};

const listarProgramas = async () => {
  try {
    const { data } = await programaService.show(1)
    programasData.value = data;
  } catch (error) {
    console.error("Error al cargar los programas:", error);
  }
};

// Ejecutar cuando se monta el componente
onMounted(() => {
  listarPlanPrograma();
  listarClasificador();
  listarPlanes();
  listarProgramas();
});


</script>

<style scoped>
/* Estilos personalizados si los necesitas */
</style>-