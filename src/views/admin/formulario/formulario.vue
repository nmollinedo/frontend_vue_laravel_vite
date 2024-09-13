<template>
  <div class="dictamen-container">
  <h2>Lista de Transferencias</h2>

  <!-- Filtro por estado de los proyectos usando PrimeVue Dropdown -->
  <div>
    <label for="estado">Estado:</label>
    <Dropdown 
      id="estado" 
      :options="estados" 
      v-model="estadoSeleccionado" 
      optionLabel="descripcion" 
      @change="filtrarProyectos" 
      placeholder="Seleccionar Estado" />
  </div>

        <!-- Botón para agregar un formulario 
  <Button label="Agregar Formulario" icon="pi pi-plus" @click="abrirModal" class="p-mt-2" />-->

    <!-- Tabla de Proyectos -->
    <div>
  <!-- DataTable de PrimeVue con paginación -->
  <DataTable 
    :value="proyectos" 
    paginator 
    :rows="5" 
    :rowsPerPageOptions="[5, 10, 20]" 
    responsiveLayout="scroll">
    
    <template #header>
      <div class="table-header">
        <h2>Transferencias</h2> 
      </div>
    </template>
    
    <Column field="codigo_tpp" header="CÓDIGO TPP" sortable></Column>
    <Column field="nombre_formal" header="Nombre" sortable></Column>
    <Column field="fecha_inicio" header="Fecha Inicio" sortable></Column>
    <Column field="fecha_termino" header="Fecha Término" sortable></Column>
    <Column field="clasificacion" header="Clasificación" sortable></Column>
    <Column field="entidad" header="Ent." sortable></Column>
    <Column field="estado" header="Estado" sortable></Column>

    <Column header="Acciones">
      <template #body="slotProps">
        <Button 
          label="Ver Fomulario" 
          icon="pi pi-eye" 
          @click="abrirModalVer(slotProps.data.id)" 
          class="p-button-text" />
     
        <Button 
          label="Agregar Formulario" 
          icon="pi pi-plus" 
          @click="abrirModal(slotProps.data.id)" 
          class="p-button-text" />
      </template>

    </Column>

  </DataTable>
</div>

    <!-- Sección de Dictámenes por Etapa -->
    <div v-if="proyectoSeleccionado" class="dictamenes-etapa">
        <h3>Formulario para el proyecto: {{ proyectoSeleccionado.id }} - {{ proyectoSeleccionado.nombre_tpp }}</h3>

        <!-- DataTable de PrimeVue para mostrar los dictámenes -->
        <DataTable :value="dictamenes" v-if="dictamenes.length > 0" class="p-mt-4">
          
          <Column header="Ver" body="verTemplate"></Column>
          <Column field="transferencia_id" body="Id"></Column>
          <Column field="respaldo_pregunta_3" header="Tipo de dictamen"></Column>
        <!--  <Column field="etapa" header="Etapa"></Column> -->
          <Column field="fecha_pregunta_3" header="Fecha Dictamen"></Column>
          <Column field="fecha_inicio_etapa" header="Fecha Inicio Etapa"></Column>
          <Column field="fecha_termino_etapa" header="Fecha Termino Etapa"></Column>
          <Column field="usuario_cierre" header="Usuario Cierre"></Column>
          <Column header="Imprimir" body="imprimirTemplate"></Column>
          <Column header="Acciones">
            <template #body="slotProps">
              <Button 
                label="Editar Fomulario" 
                icon="pi pi-pencil" 
                @click="toggleDictamen(slotProps.data.id)" 
                class="p-button-text" />
            </template>
          </Column>
        </DataTable>
      </div>

      <Dialog :visible="mostrarModalVer" modal :style="{ width: '50vw' }" :draggable="false" :closable="false">
        <template v-slot:header>
              <span>Ver formulario</span>
              <span>   </span>
              <span>   </span>
              <span>   </span>
              <span>  </span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            <Button icon="pi pi-times" @click="cerrarModalVer" class="p-button-text"></Button>
        </template>
        <div class="dictamenes-etapa">
              <h3>Formulario para el proyecto: </h3>

              <!-- DataTable de PrimeVue para mostrar los dictámenes -->
              <DataTable :value="dictamenes"  class="p-mt-4">
                
                <Column header="Ver" body="verTemplate"></Column>
                <Column field="transferencia_id" body="Id"></Column>
                <Column field="tipo_dictamen_id" header="Tipo de dictamen"></Column>
              <!--  <Column field="etapa" header="Etapa"></Column> -->
                <Column field="fecha_dictamen" header="Fecha Dictamen"></Column>
                <Column field="etapa_fecha_inicio" header="Fecha Inicio Etapa"></Column>
                <Column field="etapa_fecha_fin" header="Fecha Termino Etapa"></Column>
                <Column field="usuario_cierre" header="Usuario Cierre"></Column>
                <Column header="Imprimir" body="imprimirTemplate"></Column>
                <Column header="Acciones">
                  <template #body="slotProps">
                    <Button 
                      label="Editar Fomulario" 
                      icon="pi pi-pencil" 
                      @click="abrirModalEdit(slotProps.data.id)" 
                      class="p-button-text" />
                  </template>
                </Column>
              </DataTable>
            </div> 
           
      </Dialog>

      <!-- Modal para agregar formulario -->
          <Dialog :visible="mostrarModal" modal :style="{ width: '50vw' }" :draggable="false" :closable="false">
      <template v-slot:header>
        <span>Agregar Formulario</span>
        <span>   </span>
              <span>   </span>
              <span>   </span>
              <span>  </span>
              <span></span>
              <span></span>
        <Button icon="pi pi-times" @click="cerrarModal" class="p-button-text"></Button>
      </template>
       <!-- Displaying the received ID -->
       <div>
        <label for="id">ID del elemento seleccionado:</label>
        <input type="text" v-model="formId" readonly class="border rounded-md p-2">
      </div>
      <div style="max-height: 70vh; overflow-y: auto;">
        <h2>Datos del Formulario</h2>
        
        <!-- Select para Etapa -->
        <div class="field">
          <label for="etapa">Etapa del Formulario</label>
          <Dropdown v-model="form.etapa" :options="etapas" optionLabel="nombre" optionValue="id" placeholder="Seleccionar..."></Dropdown>
        </div>

        <!-- Fechas -->
        <div class="field">
          <label>Duración (Inicio y Término de Etapa)</label>
          <Calendar v-model="form.fechaInicio" dateFormat="dd/mm/yy" placeholder="Fecha Inicio"></Calendar>
          <Calendar v-model="form.fechaTermino" dateFormat="dd/mm/yy" placeholder="Fecha Término"></Calendar>
        </div>

        <div class="field">
          <label>Fecha de registro del Formulario</label>
          <Calendar v-model="form.fechaRegistro" dateFormat="dd/mm/yy" placeholder="Fecha Registro"></Calendar>
        </div>

        <h2>Justificación y Respaldo</h2>

        <!-- Preguntas con radio buttons -->
        <div >  
              <p>1. ¿Los recursos asignados corresponden a un gasto para transferencias de capital "transferencia público privada"?</p>
              <label>
                <input type="radio" :name="'pregunta1'" value="Si" v-model="form.preguntas1">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta1'" value="No" v-model="form.preguntas1">
                No
              </label>
              
            </div>

        <!-- Repite el patrón para las demás preguntas -->
        <div >  
              <p>2. ¿La transferencia público privada es para el financiamiento de un proyecto de inversión en especie?</p>
              <label>
                <input type="radio" :name="'pregunta2'" value="Si" v-model="form.preguntas2">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta2'" value="No" v-model="form.preguntas2">
                No
              </label>
              
            </div>
            <div >  
              <p>3. ¿La entidad o el área responsable, se encuentra autorizada para realizar transferencias público privadas?</p>
              <label>
                <input type="radio" :name="'pregunta3'" value="Si" v-model="form.preguntas3">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta3'" value="No" v-model="form.preguntas3">
                No
              </label>
              <div>
                <label for="documento">Documento:</label>
                <input type="text" class="border rounded-md p-2">
                <label for="documento">Fecha:</label>
                <input type="date" class="border rounded-md p-2">
              </div>
            </div>
            <div >  
              <p>4. ¿Se cuenta con la Reglamentación para Transferencias público privadas aprobado por instancia competente?</p>
              <label>
                <input type="radio" :name="'pregunta4'" value="Si" v-model="form.preguntas3">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta4'" value="No" v-model="form.preguntas3">
                No
              </label>
              <div>
                <label for="documento">Documento:</label>
                <input type="text" class="border rounded-md p-2">
                <label for="documento">Fecha:</label>
                <input type="date" class="border rounded-md p-2">
              </div>
            </div>  
            <div >  
              <p>5. ¿Se cuenta con el convenio vigente y está suscrito por autoridad competente?</p>
              <label>
                <input type="radio" :name="'pregunta5'" value="Si" v-model="form.preguntas3">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta5'" value="No" v-model="form.preguntas3">
                No
              </label>
              <div>
                <label for="documento">Documento:</label>
                <input type="text" class="border rounded-md p-2">
                <label for="documento">Fecha:</label>
                <input type="date" class="border rounded-md p-2">
              </div>
            </div> 
            <div >  
              <p>6. ¿Se cuenta con la Norma emitida por instancia competente que apruebe la transferencia público privada, estableciendo el importe, uso y destino de la misma?</p>
              <label>
                <input type="radio" :name="'pregunta6'" value="Si" v-model="form.preguntas3">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta6'" value="No" v-model="form.preguntas3">
                No
              </label>
              <div>
                <label for="documento">Documento:</label>
                <input type="text" class="border rounded-md p-2">
                <label for="documento">Fecha:</label>
                <input type="date" class="border rounded-md p-2">
              </div>
            </div> 

             <!-- Datos adicionales -->
             <div>
              <label for="mae">Nombre Máxima Autoridad Ejecutiva (MAE)</label>
              <input type="text" v-model="form.mae" class="border rounded-md p-2">
            </div>
            <div>
              <label for="cargoMae">Cargo MAE</label>
              <input type="text" v-model="form.cargoMae" class="border rounded-md p-2">
            </div>
            <div>
              <label for="ciMae">C.I. MAE</label>
              <input type="text" v-model="form.ciMae" class="border rounded-md p-2">
            </div>
            <div>
              <label for="docMae">Documento de Designación MAE</label>
              <input type="text" v-model="form.docMae" class="border rounded-md p-2">
            </div>

            <div>
              <label for="mae">Nombre Responsable del Proyecto</label>
              <input type="text" v-model="form.mae" class="border rounded-md p-2">
            </div>
            <div>
              <label for="cargoMae">Cargo Responsable</label>
              <input type="text" v-model="form.cargoMae" class="border rounded-md p-2">
            </div>
            <div>
              <label for="ciMae">Unidad Responsable</label>
              <input type="text" v-model="form.ciMae" class="border rounded-md p-2">
            </div>
            <div>
              <label for="docMae">C.I. Responsable</label>
              <input type="text" v-model="form.docMae" class="border rounded-md p-2">
            </div>
      </div>

      <template v-slot:footer>
        <Button label="Grabar" icon="pi pi-check" @click="guardar()" class="p-button-primary"></Button>
        <Button label="Cerrar" icon="pi pi-times" @click="cerrarModal" class="p-button-secondary"></Button>
      </template>
    </Dialog>

  <!-- Modal para editar formulario -->
    <Dialog :visible="mostrarModalEdit" modal :style="{ width: '50vw' }" :draggable="false" :closable="false">
      <template v-slot:header>
              <span>Agregar Formulario</span>
              <span>   </span>
              <span>   </span>
              <span>   </span>
              <span>   </span>
              <span>   </span>
              <span>   </span>
        <Button icon="pi pi-times" @click="cerrarModalEdit" class="p-button-text"></Button>
      </template>
      
      <div style="max-height: 70vh; overflow-y: auto;">
        <h2>Datos del formulario</h2>
        
        <!-- Select para Etapa -->
        <div class="field">
          <label for="etapa">Etapa del Formulario</label>
          <Dropdown v-model="form.etapa" :options="etapas" optionLabel="nombre" optionValue="id" placeholder="Seleccionar..."></Dropdown>
        </div>

        <!-- Fechas -->
        <div class="field">
          <label>Duración (Inicio y Término de Etapa)</label>
          <Calendar v-model="form.fechaInicio" dateFormat="dd/mm/yy" placeholder="Fecha Inicio"></Calendar>
          <Calendar v-model="form.fechaTermino" dateFormat="dd/mm/yy" placeholder="Fecha Término"></Calendar>
        </div>

        <div class="field">
          <label>Fecha de registro del Formulario</label>
          <Calendar v-model="form.fechaRegistro" dateFormat="dd/mm/yy" placeholder="Fecha Registro"></Calendar>
        </div>

        <h2>Justificación y Respaldo</h2>

        <!-- Preguntas con radio buttons -->
        <div >  
              <p>1. ¿Los recursos asignados corresponden a un gasto para transferencias de capital "transferencia público privada"?</p>
              <label>
                <input type="radio" :name="'pregunta1'" value="Si" v-model="form.preguntas1">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta1'" value="No" v-model="form.preguntas1">
                No
              </label>
              
            </div>

        <!-- Repite el patrón para las demás preguntas -->
        <div >  
              <p>2. ¿La transferencia público privada es para el financiamiento de un proyecto de inversión en especie?</p>
              <label>
                <input type="radio" :name="'pregunta2'" value="Si" v-model="form.preguntas2">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta2'" value="No" v-model="form.preguntas2">
                No
              </label>
              
            </div>
            <div >  
              <p>3. ¿La entidad o el área responsable, se encuentra autorizada para realizar transferencias público privadas?</p>
              <label>
                <input type="radio" :name="'pregunta3'" value="Si" v-model="form.preguntas3">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta3'" value="No" v-model="form.preguntas3">
                No
              </label>
              <div>
                <label for="documento">Documento:</label>
                <input type="text" class="border rounded-md p-2">
                <label for="documento">Fecha:</label>
                <input type="date" class="border rounded-md p-2">
              </div>
            </div>
            <div >  
              <p>4. ¿Se cuenta con la Reglamentación para Transferencias público privadas aprobado por instancia competente?</p>
              <label>
                <input type="radio" :name="'pregunta4'" value="Si" v-model="form.preguntas3">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta4'" value="No" v-model="form.preguntas3">
                No
              </label>
              <div>
                <label for="documento">Documento:</label>
                <input type="text" class="border rounded-md p-2">
                <label for="documento">Fecha:</label>
                <input type="date" class="border rounded-md p-2">
              </div>
            </div>  
            <div >  
              <p>5. ¿Se cuenta con el convenio vigente y está suscrito por autoridad competente?</p>
              <label>
                <input type="radio" :name="'pregunta5'" value="Si" v-model="form.preguntas3">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta5'" value="No" v-model="form.preguntas3">
                No
              </label>
              <div>
                <label for="documento">Documento:</label>
                <input type="text" class="border rounded-md p-2">
                <label for="documento">Fecha:</label>
                <input type="date" class="border rounded-md p-2">
              </div>
            </div> 
            <div >  
              <p>6. ¿Se cuenta con la Norma emitida por instancia competente que apruebe la transferencia público privada, estableciendo el importe, uso y destino de la misma?</p>
              <label>
                <input type="radio" :name="'pregunta6'" value="Si" v-model="form.preguntas3">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta6'" value="No" v-model="form.preguntas3">
                No
              </label>
              <div>
                <label for="documento">Documento:</label>
                <input type="text" class="border rounded-md p-2">
                <label for="documento">Fecha:</label>
                <input type="date" class="border rounded-md p-2">
              </div>
            </div> 

             <!-- Datos adicionales -->
             <div>
              <label for="mae">Nombre Máxima Autoridad Ejecutiva (MAE)</label>
              <input type="text" v-model="form.mae" class="border rounded-md p-2">
            </div>
            <div>
              <label for="cargoMae">Cargo MAE</label>
              <input type="text" v-model="form.cargoMae" class="border rounded-md p-2">
            </div>
            <div>
              <label for="ciMae">C.I. MAE</label>
              <input type="text" v-model="form.ciMae" class="border rounded-md p-2">
            </div>
            <div>
              <label for="docMae">Documento de Designación MAE</label>
              <input type="text" v-model="form.docMae" class="border rounded-md p-2">
            </div>

            <div>
              <label for="mae">Nombre Responsable del Proyecto</label>
              <input type="text" v-model="form.mae" class="border rounded-md p-2">
            </div>
            <div>
              <label for="cargoMae">Cargo Responsable</label>
              <input type="text" v-model="form.cargoMae" class="border rounded-md p-2">
            </div>
            <div>
              <label for="ciMae">Unidad Responsable</label>
              <input type="text" v-model="form.ciMae" class="border rounded-md p-2">
            </div>
            <div>
              <label for="docMae">C.I. Responsable</label>
              <input type="text" v-model="form.docMae" class="border rounded-md p-2">
            </div>
      </div>

      <template v-slot:footer>
        <Button label="Grabar" icon="pi pi-check" @click="guardarFormulario()" class="p-button-primary"></Button>
        <Button label="Cerrar" icon="pi pi-times" @click="cerrarModalEdit" class="p-button-secondary"></Button>
      </template>
    </Dialog>



  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Fieldset from "primevue/fieldset";
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
//import { Dialog } from 'primevue/dialog';
//import { Dropdown } from 'primevue/dropdown';
//import { Calendar } from 'primevue/calendar';
//import { RadioButton } from 'primevue/radiobutton';
//import { Button } from 'primevue/button';
import axios from 'axios';
import transferenciaService from '../../../services/transferencia.service';
import dictamenService from '../../../services/dictamen.service';

// Variables reactivas
const proyectos = ref([]);
const dictamenes = ref([]);
const proyectosFiltrados = ref([]);
//const transferencia = ref([]);
//const transferenciasFiltrados = ref([]);
// Variables reactivas
//const proyectos = ref([]);
//const dictamenes = ref([]);
//const estadoSeleccionado = ref('en-registro');
const proyectoSeleccionado = ref(null);
const etapaSeleccionada = ref('');
const mostrarModal = ref(false);  // Controla la visibilidad del modal
const mostrarModalVer = ref(false);  // Controla la visibilidad del modal
const mostrarModalEdit = ref(false);  // Controla la visibilidad del modal
// ID for the selected form
const formId = ref(null);
const id = null;
const nuevoDictamen = ref({
etapa: '',
fechaInicio: '',
fechaTermino: '',
// Otros campos adicionales...
});

const form = ref({
etapa: '',
fechaInicio: '',
fechaTermino: '',
fechaRegistro: '',
preguntas: '',
documentos: '',
numero: '',
mae: '',
cargoMae: '',
ciMae: '',
// otros campos
});

const etapas = ref([
{ id: 1, nombre: 'Inicio de Etapa' },
{ id: 2, nombre: 'Etapa 2' },
// Añadir más etapas aquí
]);
/*
const dictamenes = ref([
{ id: 1, nombre: 'Dictamenes 1' },
{ id: 2, nombre: 'Dictamenes 2' },
// Añadir más etapas aquí
]);*/

const preguntas = ref([
{ texto: '1. ¿Los recursos asignados corresponden a un gasto para transferencias de capital "transferencia público privada"?' },
{ texto: '2. ¿La transferencia público privada es para el financiamiento de un proyecto de inversión en especie?' },
{ texto: '3. ¿La entidad o el área responsable, se encuentra autorizada para realizar transferencias público privadas?' },
{ texto: '4. ¿Se cuenta con la Reglamentación para Transferencias público privadas aprobado por instancia competente?' },
{ texto: '5. ¿Se cuenta con el convenio vigente y está suscrito por autoridad competente?' },
{ texto: '6. ¿Se cuenta con la Norma emitida por instancia competente que apruebe la transferencia público privada, estableciendo el importe, uso y destino de la misma?' },
]);

const estados = ref([
{ id: 1, descripcion: 'En registro' },
{ id: 2, descripcion: 'Completado' }
]);

const estadoSeleccionado = ref(null);
/*
const filtrarProyectos = () => {
// Lógica para filtrar los proyectos según el estado seleccionado
console.log('Filtrar proyectos por estado:', estadoSeleccionado.value);
};*/

const guardar = async () => {
  console.log('ID entro:', formId.value);
  if (!formId.value) {
    console.error('No se ha seleccionado un ID');
    return;
  }

  // Prepare the form data
  const formData = {
    id: formId.value, // Ensure the ID is sent
    etapa: form.value.etapa,
    fechaRegistro: form.value.fechaRegistro,
    fechaInicio: form.value.fechaInicio,
    fechaTermino: form.value.fechaTermino,
    preguntas1: form.value.preguntas1,
    // Add other form fields here
  };
  try {
    const response = await dictamenService.guadarForm(formData.id,formData);
    //dictamenes.value = data;
    console.log('Formulario guardado con éxito:', response.data);
    cerrarModal();
  } catch (error) {
    console.error('Error al guardar el formulario:', error);
  }
};

function cerrar() {
mostrarModal.value = false;  // Oculta el modal estableciendo su valor a falso
form.value = {};  // Limpia el formulario, reinicia el objeto form
console.log("Formulario cerrado");
}

// Cargar proyectos al montar el componente
onMounted(async () => {
  await cargarProyectos();
  //await getTransferencias();
});

// Función para cargar proyectos desde la API //listar transferencias
const cargarProyectos = async () => {
  try {
    //const response = await axios.get('/api/proyectos'); 
    const { data } = await transferenciaService.index();
    proyectos.value = data;
    //proyectos.value = response.data;
    filtrarProyectos();
  } catch (error) {
    console.error('Error al cargar los proyectos:', error);
  }
};



// Filtrar proyectos por estado
const filtrarProyectos = () => {
  proyectosFiltrados.value = proyectos.value.filter(
    (proyecto) => proyecto.estado === estadoSeleccionado.value
  );
};

// Función para mostrar los dictámenes de un proyecto
const toggleDictamen = async (id) => {
  try {
    // Buscar el proyecto seleccionado
    proyectoSeleccionado.value = proyectos.value.find(
      (proyecto) => proyecto.id === id
    );

    // Cargar dictámenes para el proyecto seleccionado
    //const response = await axios.get(`/api/dictamen/${id}`);
    const { data } = await dictamenService.show(58);
    dictamenes.value = data;
    //dictamenes.value = response;
  } catch (error) {
    console.error('Error al cargar los dictámenes:', error);
  }
};

// Función para abrir el modal
const abrirModalVer = async (id) => {
  try {
    // Buscar el proyecto seleccionado
  /*  proyectoSeleccionado.value = proyectos.value.find(
      (proyecto) => proyecto.id === id
    );*/

    // Cargar dictámenes para el proyecto seleccionado
    //const response = await axios.get(`/api/dictamen/${id}`);
    const { data } = await dictamenService.show(id);
    dictamenes.value = data;
    //dictamenes.value = response;
  } catch (error) {
    console.error('Error al cargar los dictámenes:', error);
  }
mostrarModalVer.value = true;
};

// Función para cerrar el modal
const cerrarModalVer = () => {
mostrarModalVer.value = false;
};

// Función para abrir el modal
const abrirModalEdit = () => {
mostrarModalEdit.value = true;
};

// Función para cerrar el modal
const cerrarModalEdit = () => {
mostrarModalEdit.value = false;
};

// Función para abrir el modal
// Function to open the modal and receive the ID
const abrirModal = (id) => {
  formId.value = id; // Store the ID
  console.log("ID",formId.value);
  mostrarModal.value = true; // Open the modal
};

// Función para cerrar el modal
const cerrarModal = () => {
mostrarModal.value = false;
};

// Función para guardar el nuevo dictamen
const guardarFormulario = async (id) => {
  console.log("Formulario",id)
try {
  await axios.post(`/api/dictamenes/${proyectoSeleccionado.value.codigo_tpp}`, nuevoDictamen.value);
  await toggleDictamen(proyectoSeleccionado.value.codigo_tpp);  // Recargar los dictámenes
  cerrarModal();  // Cerrar el modal después de guardar
} catch (error) {
  console.error('Error al agregar el dictamen:', error);
}
};

// Función para agregar un nuevo dictamen
/*  const agregarDictamen = async () => {
  try {
    const nuevoDictamen = {
      etapa: etapaSeleccionada.value,
      // Otros detalles del dictamen
    };
    
    await axios.post(`/api/dictamenes/${proyectoSeleccionado.value.codigo_tpp}`, nuevoDictamen);

    // Recargar los dictámenes
    await toggleDictamen(proyectoSeleccionado.value.codigo_tpp);
  } catch (error) {
    console.error('Error al agregar el dictamen:', error);
  }
};*/
</script>

<style scoped>
.dictamen-container {
  width: 100%;
  margin: 0 auto;
}

.tabla-proyectos, .dictamenes-etapa table {
  width: 100%;
  border-collapse: collapse;
}

.tabla-proyectos th, .dictamenes-etapa th, .tabla-proyectos td, .dictamenes-etapa td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.tabla-proyectos th {
  background-color: #f4f4f4;
}

.dictamenes-etapa {
  margin-top: 20px;
}

/* Estilos para el modal */
.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: rgb(185, 220, 243);
  padding: 20px;
  border-radius: 5px;
  width: 50%;
  max-width: 600px;
}

.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
}
</style>
