<template>
    <div class="dictamen-container">
      <h2>Lista de Proyectos</h2>
  
      <!-- Filtro por estado de los proyectos -->
      <div>
        <label for="estado">Estado:</label>
        <select id="estado" v-model="estadoSeleccionado" @change="filtrarProyectos">
          <option value="en-registro">En registro</option>
          <option value="completado">Completado</option>
        </select>
      </div>
  
      <!-- Tabla de Proyectos -->
      <table class="tabla-proyectos">
        <thead>
          <tr>
            <th>CÓDIGO TPP</th>
            <th>Nombre</th>
            <th>Fecha Inicio</th>
            <th>Fecha Término</th>
            <th>Clasificación</th>
            <th>Ent.</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="proyecto in proyectos" :key="proyecto.codigo_tpp">
            <td>{{ proyecto.codigo_tpp }}</td>
            <td>{{ proyecto.nombre_formal }}</td>
            <td>{{ proyecto.fecha_inicio }}</td>
            <td>{{ proyecto.fecha_termino }}</td>
            <td>{{ proyecto.clasificacion }}</td>
            <td>{{ proyecto.entidad }}</td>
            <td>{{ proyecto.estado }}</td>
            <td>
              <button @click="toggleDictamen(proyecto.codigo_tpp)">Ver Dictámenes</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Sección de Dictámenes por Etapa -->
      <div v-if="proyectoSeleccionado" class="dictamenes-etapa">
        <h3>Dictámenes para el proyecto: {{ proyectoSeleccionado.nombre_tpp }}</h3>
  
        <label for="etapa">Dictamen de Etapa:</label>
        <select id="etapa" v-model="etapaSeleccionada">
          <option value="" disabled>-- Seleccionar etapa --</option>
          <option value="inicio_etapa">Inicio de etapa - TPP</option>
          <option value="ejecucion">Ejecución</option>
          <option value="cierre">Cierre</option>
        </select>
  
        <button @click="abrirModal">Agregar Dictamen</button>
  
        <!-- Tabla de dictámenes registrados -->
        <table v-if="dictamenes.length > 0">
          <thead>
            <tr>
              <th>Ver</th>
              <th>Tipo de dictamen</th>
              <th>Etapa</th>
              <th>Fecha Dictamen</th>
              <th>Fecha Inicio Etapa</th>
              <th>Fecha Termino Etapa</th>
              <th>Usuario Cierre</th>
              <th>Imprimir</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dictamen in dictamenes" :key="dictamen.id">
              <td><button>Ver</button></td>
              <td>{{ dictamen.tipo }}</td>
              <td>{{ dictamen.etapa }}</td>
              <td>{{ dictamen.fecha_dictamen }}</td>
              <td>{{ dictamen.fecha_inicio_etapa }}</td>
              <td>{{ dictamen.fecha_termino_etapa }}</td>
              <td>{{ dictamen.usuario_cierre }}</td>
              <td><button>Imprimir</button></td>
            </tr>
          </tbody>
        </table>
      </div>
        <!-- Modal para agregar dictamen -->
      <div v-if="mostrarModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="cerrarModal">&times;</span>
          <h3>Agregar Dictamen</h3>
          
          <!-- Formulario de dictamen -->
          <div class="form-container">
              <h2>Datos de la Etapa</h2>
              
              <!-- Select para Etapa -->
              <div>
                <label for="etapa">Etapa del Dictamen</label>
                <select v-model="form.etapa">
                  <option value="">Seleccionar...</option>
                  <option v-for="etapa in etapas" :key="etapa.id" :value="etapa.id">{{ etapa.nombre }}</option>
                </select>
              </div>

              <!-- Fechas -->
              <div>
                <label for="duracion">Duración (Inicio y Término de Etapa)</label>
                <input type="date" v-model="form.fechaInicio" placeholder="dd-mm-aaaa">
                <input type="date" v-model="form.fechaTermino" placeholder="dd-mm-aaaa">
              </div>

              <div>
                <label for="registro">Fecha de registro del Dictamen</label>
                <input type="date" v-model="form.fechaRegistro">
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

              
              <!--
              <div v-if="form.preguntas && form.preguntas.length" v-for="(pregunta, index) in preguntas" :key="index">  
                <p>{{ pregunta.texto }}</p>
                <label>
                  <input type="radio" :name="'pregunta_' + index" value="Si" v-model="form.preguntas[index]">
                  Sí
                </label>
                <label>
                  <input type="radio" :name="'pregunta_' + index" value="No" v-model="form.preguntas[index]">
                  No
                </label>
                <div v-if="form.preguntas[index] === 'Si'">
                  <label for="documento">Documento:</label>
                  <input type="text" v-model="form.documentos[index].numero">
                  <label for="documento">Fecha:</label>
                  <input type="date" v-model="form.documentos[index].fecha">
                </div>
              </div>-->

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
              
              <!-- Otros campos... -->

              <!-- Botones de acción -->
              <button label="Guardar" 
              icon="pi pi-check"  @click="guardar" style="background-color: #1e88e5; border-color: #1e88e5; color: #fff;" >Grabar</button>
              <button style="background-color: #ec3109; border-color: #1e88e5; color: #fff;" @click="cerrar">Cerrar</button>
            </div>

          <!-- Campos adicionales del dictamen 
          <button @click="guardarDictamen">Guardar Dictamen</button>-->
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Fieldset from "primevue/fieldset";
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
  import axios from 'axios';
import transferenciaService from '../../../services/transferencia.service';
  
  // Variables reactivas
  const proyectos = ref([]);
  const proyectosFiltrados = ref([]);
  //const transferencia = ref([]);
  //const transferenciasFiltrados = ref([]);
  // Variables reactivas
//const proyectos = ref([]);
//const dictamenes = ref([]);
const estadoSeleccionado = ref('en-registro');
const proyectoSeleccionado = ref(null);
const etapaSeleccionada = ref('');
const mostrarModal = ref(false);  // Controla la visibilidad del modal
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
  preguntas: Array(6).fill(''),
  documentos: Array(6).fill({ numero: '', fecha: '' }),
  mae: '',
  cargoMae: '',
  ciMae: '',
  // otros campos
});

const etapas = ref([
  { id: 1, nombre: 'Etapa 1' },
  { id: 2, nombre: 'Etapa 2' },
  // Añadir más etapas aquí
]);

const dictamenes = ref([
  { id: 1, nombre: 'Dictamenes 1' },
  { id: 2, nombre: 'Dictamenes 2' },
  // Añadir más etapas aquí
]);

const preguntas = ref([
  { texto: '1. ¿Los recursos asignados corresponden a un gasto para transferencias de capital "transferencia público privada"?' },
  { texto: '2. ¿La transferencia público privada es para el financiamiento de un proyecto de inversión en especie?' },
  { texto: '3. ¿La entidad o el área responsable, se encuentra autorizada para realizar transferencias público privadas?' },
  { texto: '4. ¿Se cuenta con la Reglamentación para Transferencias público privadas aprobado por instancia competente?' },
  { texto: '5. ¿Se cuenta con el convenio vigente y está suscrito por autoridad competente?' },
  { texto: '6. ¿Se cuenta con la Norma emitida por instancia competente que apruebe la transferencia público privada, estableciendo el importe, uso y destino de la misma?' },
]);

function guardar() {
  // Lógica para guardar los datos
  console.log("Formulario guardado:", form.value);
}

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
  const toggleDictamen = async (codigo_tpp) => {
    try {
      // Buscar el proyecto seleccionado
      proyectoSeleccionado.value = proyectos.value.find(
        (proyecto) => proyecto.codigo_tpp === codigo_tpp
      );
  
      // Cargar dictámenes para el proyecto seleccionado
      //const response = await axios.get(`/api/dictamenes/${codigo_tpp}`);
      dictamenes.value = response.data;
    } catch (error) {
      console.error('Error al cargar los dictámenes:', error);
    }
  };

  // Función para abrir el modal
const abrirModal = () => {
  mostrarModal.value = true;
};

// Función para cerrar el modal
const cerrarModal = () => {
  mostrarModal.value = false;
};

// Función para guardar el nuevo dictamen
const guardarDictamen = async () => {
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
  