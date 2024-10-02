<template>
    <!--   <div class="card">
        <DataTable :value="transferencias" tableStyle="min-width: 50rem">
            <Column field="id" header="COD"></Column>
            <Column field="codigo_tpp" header="CODIGO"></Column>
            <Column field="nombre_formal" header="NOMBRES"></Column>
            <Column field="fecha_registro" header="FECHA INICIO"></Column>

            <Column :exportable="false" style="min-width: 12rem">{{slotProps.data}}
                <template #body="slotProps">
                  
                    <Button icon="pi pi-user-edit" rounded outlined class="mr-2" @click="mostrarDatosPersonales(slotProps.data)" />

                    <Button icon="pi pi-pencil" rounded class="mr-2" @click="funEditar(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="funEliminar(slotProps.data)" />
                </template>
</Column>

</DataTable>
</div> -->

    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Nuevo transferencia" icon="pi pi-plus" severity="secondary" class="mr-2"
                        @click="openNew" />
                </template>
                <!--
                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template> -->
            </Toolbar>

            <DataTable ref="dt" :value="transferencias" dataKey="id" :paginator="true" :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} transferenciaos" >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Gestión Proyectos</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText placeholder="Buscar..." />
                        </IconField>
                    </div>
                    
                </template>

                <Column field="id" header="COD" sortable style="min-width: 1rem"></Column>
                <Column field="codigo_tpp" header="CODIGO" sortable style="min-width: 7rem"></Column>
                <Column field="nombre_formal" header="NOMBRES" sortable style="min-width: 12rem"></Column>
                
                <Column field="fecha_inicio" header="FECHA INICIO"></Column>
                <Column field="fecha_termino" header="FECHA TERMINO"></Column>
                <Column field="entidad" header="ENTIDAD"></Column>
                <Column field="estado" header="ESTADO"></Column>

                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button
                            v-if="slotProps.data.estado_id===1"  
                           icon="pi pi-pencil" outlined rounded class="mr-2"
                            @click="editTransferencia(slotProps.data)"
                            style="background-color: #1e88e5; border-color: #1e88e5; color: #fff;" />
                        <Button
                        v-if="slotProps.data.estado_id===1"  
                        icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteTransferencia(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="transferenciaDialog" :style="{ width: '650px' }" header="Nueva transferencias" :modal="true">
          <!-- {{ transferencia }}  -->
            <div class="flex flex-col gap-6">
                <Fieldset legend="">
                    <td>
                        <label for="Entidad" class="block font-bold mb-3">Responsable de la operacion</label>
                    </td>
                    <div>

                        <Dropdown v-model="selectedEntidad" :options="entidades" optionLabel="nombre"
                            placeholder="Seleccionar una entidad" class="w-full md:w-14rem" />
                    <!--    <p>ID de la ciudad seleccionada: {{ selectedEntidad.id }}</p>  -->
                    </div>
                    <div>
                        <label for="responsableEjecucion" class="block font-bold mb-3">Responsable de la
                            ejecucion</label>
                        <!-- Aquí el campo InputText se llena automáticamente con el nombre de la entidad seleccionada -->
                        <InputText v-model="selectedEntidadNombre" id="responsableEjecucion" fluid />
                    </div>

                </Fieldset>


                <div class="grid grid-cols-10 gap-1">
                    <div class="col-span-2">
                        <label for="price" class="block font-bold mb-2">Codigo TPP</label>

                    </div>
                    <div class="col-span-2">
                        <label for="codigo_tpp1" class="block font-bold mb-2"></label>
                        <InputText id="codigo_tpp1" value='TPP' integeronly fluid disabled />
                    </div>
                    <div class="col-span-2">
                        <label for="codigo_tpp2" class="block font-bold mb-2"></label>
                        <InputText id="codigo_tpp2" value='0000' integeronly fluid disabled />
                    </div>
                    <div class="col-span-2">
                        <label for="codigo_tpp" class="block font-bold mb-2"></label>
                        <InputText id="codigo_tpp" value='0000000' integeronly fluid disabled />
                    </div>
                </div>
                <div>
                    <label for="objeto" class="block font-bold mb-3">Objeto</label>
                    <InputText id="objeto" v-model.trim="transferencia.objeto" required="true" autofocus
                        :invalid="submitted && !transferencia.objeto" fluid />
                </div>
                <div>
                    <label for="localizacion" class="block font-bold mb-3">Localización</label>
                    <InputText id="localizacion" v-model.trim="transferencia.localizacion" required="true" autofocus
                        :invalid="submitted && !transferencia.localizacion" fluid />
                </div>
                <div>
                    <label for="nombre_tpp">Nombre TPP</label>
                    <InputText id="nombre_tpp" :value="nombreTpp" readonly fluid />
                </div>

                <div>
                    <label for="denominacion_convenio" class="block font-bold mb-3">Denominación del Convenio</label>
                    <Textarea 
                    id="denominacion_convenio" 
                    v-model="transferencia.denominacion_convenio" 
                    rows="4" 
                    fluid 
                    @input="validateDenominacion"
                    />
                    <span v-if="denominacionError" class="text-red-500">Máximo 110 caracteres permitidos</span>
                </div>
          
                    <label for="Entidad" class="block font-bold mb-3">Area de Influencia</label>
              
                <div><!--{{areas}}-->

                    <Dropdown v-model="selectedArea" :options="areas" optionLabel="descrip_area" placeholder="Seleccione una área"
                        class="w-full md:w-14rem" />
                    <p>ID de la ciudad seleccionada: {{ selectedArea.id }}</p>
                </div>
                <div>
                    <label for="fecha_inicio" class="block font-bold mb-3">Fecha Inicio</label>
                    <Calendar v-model="fecha_inicio" dateFormat="dd/mm/yy" showIcon />
                </div>
                <div>
                    <label for="fecha_termino" class="block font-bold mb-3">Fecha Termino</label>
                    <Calendar v-model="fecha_termino" dateFormat="dd/mm/yy" showIcon />
                </div>
<!--
                <div class="mt-3">
                    <p><strong>Fecha Inicio Seleccionada:</strong> {{ fecha_inicio }}</p>
                    <p><strong>Fecha Término Seleccionada:</strong> {{ fecha_termino }}</p>
                </div>
            -->
            
            </div>
            <div v-if="error" class="text-red-500">
                {{ error }}
            </div>


            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog"
                    style="background-color: #1e88e5; border-color: #1e88e5; color: #fff;" />
                <Button label="Guardar" icon="pi pi-check" @click="validarFechas"
                    style="background-color: #1e88e5; border-color: #1e88e5; color: #fff;" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deletetransferenciaDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="transferencia">Are you sure you want to delete <b>{{ transferencia.name }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deletetransferenciaDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deletetransferencia" />
            </template>
        </Dialog>
    </div>



    <Dialog v-model:visible="visibleDialogTransferencia" modal header="Actualizar Datos" :style="{ width: '56rem' }">
        <!--    <div class="p-6">
        <p>Codigo TPP: <span class="text-lg font-medium text-gray-900">{{  }}</span></p>
        <p>Nombre: <span class="text-lg font-medium text-gray-900">{{  }}</span></p>
        </div>
  {{ transferencia }}   -->
        

        <div class="mt-6 mb-6 space-y-6" style="max-width: 750px; margin-top: 20px; margin-bottom: 20px;">

            <basic-tabs class="mt-6 mb-6 space-y-6 " style="max-width: 750px; margin-top: 20px; margin-bottom: 20px;">
                <basic-tab title="Aspectos Generales">
                    <div class="flex flex-col gap-6">
                       <!-- <Fieldset legend="Header">
                            <label for="Entidad" class="block font-bold mb-3">Responsable de la Operación</label>
                            <Dropdown v-model="transferencia.entidad_operadora" :options="entidades"
                                optionLabel="nombre" placeholder="Seleccione Entidad" class="w-full md:w-14rem" />

                            <label for="responsableEjecucion" class="block font-bold mb-3">Responsable de la
                                Ejecución</label>
                            <Dropdown v-model="transferencia.entidad_ejecutora" :options="entidades_ejecutoras"
                                optionLabel="nombre" placeholder="Seleccione Entidad Ejecutora" class="w-full md:w-14rem" />    
                            
                        </Fieldset> -->
                <Fieldset legend="">
                    <td> <!--{{transferencia}}-->
                        <label for="Entidad" class="block font-bold mb-3">Responsable de la operacion</label>
                    </td>
                    <div>

                        <Dropdown v-model="selectedEntidad" :options="entidades" optionLabel="nombre"
                            placeholder="Seleccionar una entidad" class="w-full md:w-14rem" />
                        <!--    <p>ID de la ciudad seleccionada: </p>  -->
                        </div>
                    <div>
                        <label for="responsableEjecucion" class="block font-bold mb-3">Responsable de la
                            ejecucion</label>
                        <!-- Aquí el campo InputText se llena automáticamente con el nombre de la entidad seleccionada -->
                        <InputText v-model="selectedEntidadNombre" id="responsableEjecucion" fluid />
                    </div>

                </Fieldset>

                        <div class="grid grid-cols-10 gap-1">
                            <div class="col-span-2">
                                <label for="codigo_tpp" class="block font-bold mb-2">Código TPP</label>
                                <InputText id="codigo_tpp" v-model="transferencia.codigo_tpp" integeronly fluid
                                    disabled />
                            </div>
                        </div>

                        <div>
                        <!--    <p><strong>Fecha Inicio Seleccionada:</strong>{{ objeto }}</p> -->
                            <label for="objeto" class="block font-bold mb-3">Objeto</label>
                            <InputText id="objeto" v-model="transferencia.objeto" required="true" fluid />
                        </div>
                <!--{{ transferencia.localizacion }}-->        
                        <div>
                            <label for="localizacion" class="block font-bold mb-3">Localización</label>
                            <InputText id="localizacion" v-model="transferencia.localizacion" required="true" fluid />
                        </div>
                        <div>
                            <label for="nombre_tpp">Nombre TPP</label>
                            <InputText id="nombre_tpp" :value="nombreTpp" readonly fluid />
                        </div>
                        <div>
                            <label for="denominacion_convenio" class="block font-bold mb-3">Denominación del Convenio</label>
                            <Textarea 
                            id="denominacion_convenio" 
                            v-model="transferencia.denominacion_convenio" 
                            rows="4" 
                            fluid 
                            @input="validateDenominacion"
                            />
                            <span v-if="denominacionError" class="text-red-500">Máximo 110 caracteres permitidos</span>
                        </div>

                        <div><!--{{areas}}-->
                            <label for="area_influencia" class="block font-bold mb-3">Área de Influencia</label>
                            <Dropdown v-model="selectedArea" :options="areas" optionLabel="descrip_area"
                                placeholder="Seleccione Área" class="w-full md:w-14rem" />
                        </div>

                        <div>
                            <label for="fecha_inicio" class="block font-bold mb-3">Fecha Inicio</label>
                            <Calendar v-model="transferencia.fecha_inicio" dateFormat="dd/mm/yy" showIcon />
                        </div>

                        <div>
                            <label for="fecha_termino" class="block font-bold mb-3">Fecha Término</label>
                            <Calendar v-model="transferencia.fecha_termino" dateFormat="dd/mm/yy" showIcon />
                        </div>

                        <!--<div class="mt-3">
                            <p><strong>Fecha Inicio Seleccionada:</strong> {{ transferencia.fecha_inicio }}</p>
                            <p><strong>Fecha Término Seleccionada:</strong> {{ transferencia.fecha_termino }}</p>
                        </div>
                        <div v-if="mensaje" class="text-green-500">
                            {{ mensaje }}
                        </div>   -->
                        <div v-if="error" class="text-red-500">
                            {{ error }}
                        </div> 
                    </div>
                    <Toast />
                    
                    <Button label="Guardar datos" icon="pi pi-check" @click="validarFechasYGuardar"
                        style="background-color: #1e88e5; border-color: #1e88e5; color: #fff;" />
                </basic-tab>

                <basic-tab title="Problematica  "> <!--{{ transferencia }}-->
                    <div class="flex flex-col gap-6"> <!--{{ planes }} -->
                        <Fieldset legend="Header">
                                <!-- Plan Dropdown -->
                                <label for="Plan" class="block font-bold mb-3">Plan</label>
                                <Dropdown
                                    v-model="selectedPlan"
                                    :options="planes"
                                    optionLabel="descrip_plan"
                                    placeholder="Seleccione plan"
                                    class="w-full md:w-14rem"
                                    @change="onPlanChange"
                                />
                               <!-- {{planes}} -->
                                <!-- Programa Dropdown -->
                                <label for="Programa" class="block font-bold mb-3">Programa</label><!--{{programas}}-->
                                <Dropdown
                                    v-model="selectedPrograma"
                                    :options="programas"
                                    optionLabel="descrip_programa"
                                    placeholder="Seleccione programa"
                                    class="w-full md:w-14rem"
                                    :disabled="!selectedPlan"
                                />
                        </Fieldset>

                        <div>
                            <label for="descripcion" class="block font-bold mb-3">Descripcion</label>
                            <Textarea id="descripcion" v-model="transferencia.descripcion" rows="4" fluid />
                        </div>
                   
                        <div v-if="mensaje_prob" class="text-green-500">
                            {{ mensaje_prob }}
                        </div>     
                        <Toast />
                        <Button label="Guardar problematica" icon="pi pi-check" @click="guardarProblematica"
                        style="background-color: #1e88e5; border-color: #1e88e5; color: #fff;" />
                    </div>
                </basic-tab>

                <basic-tab title="Localizacion geografica"><!--{{transferencia}}-->
                        <div class="flex flex-col gap-6"><!--{{departamentos}}-->
                        <Fieldset legend="Header">
                            <label for="Departamento" class="block font-bold mb-3">Departamento</label>
                            <Dropdown 
                            v-model="selectedDepartamento" 
                            :options="departamentos" 
                            optionLabel="descrip_departamento"
                            placeholder="Seleccione departamento" 
                            class="w-full md:w-14rem" 
                            @change="onDepartamentoChange"
                            />
                            <!--{{municipios}} -->
                            <label for="Municipio" class="block font-bold mb-3">Municipio</label>
                            <Dropdown 
                            v-model="selectedMunicipio" 
                            :options="municipios" 
                            optionLabel="descrip_municipio"
                            placeholder="Seleccione municipio" 
                            class="w-full md:w-14rem"
                            :disabled="!selectedDepartamento"
                            @change="onMunicipioChange"
                            />
                            <!--{{poblaciones}}-->
                            <label for="Poblacion" class="block font-bold mb-3">Población</label>
                            <Dropdown 
                            v-model="selectedPoblacion" 
                            :options="poblaciones" 
                            optionLabel="descrip_poblacion"
                            placeholder="Seleccione población" 
                            class="w-full md:w-14rem"
                            :disabled="!selectedMunicipio"
                            />
                        </Fieldset>

                    <!--    <div>
                            <label for="descripcion" class="block font-bold mb-3">Cobertura</label>
                            <InputNumber v-model="transferencia.cobertura" inputId="integeronly" fluid />
                        </div> -->
                        <div>
                            <label for="descripcion" class="block font-bold mb-3">Poblacion Beneficiada</label>
                            <InputNumber v-model="transferencia.poblacion" inputId="integeronly" fluid />
                        </div>

                        <div v-if="mensaje_loc" class="text-green-500">
                            {{ mensaje_loc }}
                        </div> 
                        <Toast />
                        <Button 
                            label="Guardar localizacion" 
                            icon="pi pi-check" 
                            @click="guardarLocalizacion"
                            style="background-color: #1e88e5; border-color: #1e88e5; color: #fff;" 
                        />
                        </div>
                    </basic-tab>

            <!--        
                <basic-tab title="Etapa - Componenete">
                    <div class="flex flex-col gap-4">
                        <InputText v-model="value1" type="text" size="small" placeholder="Componente" />
                        
                        


                        <Button label="Guardar4" severity="info" raised />
                    </div>
                </basic-tab> -->


            </basic-tabs>
        </div>



    </Dialog>


    <Dialog v-model:visible="deleteTransferenciaDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="transferencia">Esta seguro de eliminar <b>{{ transferencia.nombre }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteTransferenciaDialog = false" />
            <Button label="Yes" icon="pi pi-check" @click="deleteTransferencia" />
        </template>
    </Dialog>
</template>
<script setup>
import Fieldset from "primevue/fieldset";
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import Select from "primevue/select";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import Calendar from 'primevue/calendar';
import { onMounted, ref, watch, computed, Text } from "vue";
import SelectEntidad from "./../../../components/SelectEntidad.vue";
import transferenciaService from "./../../../services/transferencia.service";
import BasicTab from "./../../../components/Tab.vue";
import BasicTabs from "./../../../components/Tabs.vue";
import entidadService from "../../../services/entidad.service";
import planService from "../../../services/plan.service";
import areaService from "../../../services/area.service";
import programaService from "../../../services/programa.service";
import departamentoService from "../../../services/departamento.service";
import municipioService from "../../../services/municipio.service";
import poblacionService from "../../../services/poblacion.service";

//import { useStore } from 'vuex';

//const store = useStore();
//const entidadId = computed(() => store.state.entidadId);

// Cambiar la entidad cuando el usuario selecciona una nueva
function cambiarEntidad(nuevaEntidad) {
  store.commit('setEntidadId', nuevaEntidad.id);
}


const selectedCity = ref();
const cities = ref([
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
]);

const transferencias = ref([]);
const plan = ref([]);
const programa = ref([]);
const departamentos = ref([]);
const municipios = ref([]);
const poblaciones = ref([]);
const entidades = ref([]);
const entidad = ref([]);
const visibleDialogTransferencia = ref(false);
const submitted = ref(false);
const transferenciaDialog = ref(false);
const error = ref('');
const mensaje = ref('');
const mensaje_prob = ref('');
const mensaje_loc = ref('');
const transferencia = ref({
    id: null,
    entidad_operadora: '',
    responsable_ejecucion: '',
    codigo_tpp: '',
    objeto: '',
    localizacion: '',
    nombre_tpp: '',
    denominacion_convenio: '',
    area_id: '',
    fecha_inicio: '',
    fecha_termino: '',
    entidad_ejecutora: '',
    unidad_ejecutora: '',
    area_influencia: '',
    plan: '',
    programa: '',
    descripcion:'',
    departamento: null,
    municipio: null,
    poblacion_id: null,
    cobertura: '',
    poblacion: ''
    });

// Inicializa el objeto transferencia con la propiedad denominacion_convenio
   
const areas = ref([]);
const selectedCountry = ref(null);
const selectedArea = ref({ id: null });
const selectedEntidad = ref({ id: null });
const selectedPlan = ref({ id: null });
const selectedPrograma = ref({ id: null });
const selectedDepartamento = ref({ id: null });
const selectedMunicipio = ref({ id: null });
const selectedPoblacion = ref({ id: null });
const selectedEntidadNombre = ref('');
const originalNombre = ref(''); // Para almacenar el nombre enviado de entidad Nombre
const isEdit = ref({isEdit: false}); // Variable para saber si es editar o nuevo
const deleteTransferenciaDialog = ref(false);
const codigo_tpp1 = 'TPP';
const codigo_tpp2 = '0047';
const codigo_tpp = '0000000';
const toast = useToast();
const fecha_inicio = ref(null);
const fecha_termino = ref(null);


const objeto = ref('');
const localizacion = ref('');
//const submitted = ref(false);


// Computed property para concatenar el nombre TPP
const nombreTpp = computed(() => {
    return `${transferencia.value.objeto ?? ''} ${transferencia.value.localizacion ?? ''}`.trim().substring(0, 110);
});


//const selectedEntidad = reactive({ id: null });
onMounted(() => {
    obtenerEntidad();
    //getEntidades();
    getPlanes();
    getAreas();
    getTransferencias();
    cargarDepartamentos();
    cargarMunicipios();
    cargarPoblaciones();
    obtenerEntidadEjecutora();
    actualizarEntidadId();
    //fetchProgramas();
});
// Computed para obtener el valor reactivo desde el store
const entidadId = ref([]);

const planes = ref([]);
const programas = ref([]);

function formatDateVista(date) {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

function onDepartamentoChange() {
    const selectedDepartamentoId = selectedDepartamento.value.id;
    console.log(selectedDepartamentoId);
    // if (transferencia.value.departamento) {
    if (selectedDepartamentoId) {
        cargarMunicipios(selectedDepartamentoId);
        municipios.value = [];
        poblaciones.value = [];
    } else {
        municipios.value = [];
        poblaciones.value = [];
    }
}

function onMunicipioChange() {
    console.log("Municipio ID",selectedMunicipio.value.id);
    const selectedMunicipioId = selectedMunicipio.value.id;
    if (selectedMunicipioId) {
        cargarPoblaciones(selectedMunicipioId);
    }
//   municipios.value = [];
//   poblaciones.value = [];
//   transferencia.value.poblacion = [];
}

async function cargarDepartamentos() {
  try {
    const { data } = await departamentoService.index();
    departamentos.value = data;
  } catch (error) {
    console.error("Error al cargar los departamentos:", error);
  }
}

async function cargarMunicipios(departamentoId) {
    console.log("Departamento ID 222",departamentoId);
  try {
    if (departamentoId) {
      const { data } = await municipioService.show(departamentoId);
      municipios.value = data;
    } else {
      municipios.value = [];
    }
  } catch (error) {
    console.error("Error al cargar los municipios:", error);
  }
}

async function cargarPoblaciones(municipioId) {
  // Simulación de la carga de poblaciones basados en el municipio seleccionado
  console.log("Municipio ID 222",municipioId);
  try {
    if (municipioId) {
        const { data } = await poblacionService.show(municipioId);
        poblaciones.value = data;
        console.log(data);
    } else {
        poblaciones.value = [];
    }
  } catch (error) {
    console.error("Error al cargar los municipios:", error);
  }
}

// Function to save data
const guardarLocalizacion = async () => {
    try {
        // Crear el payload con los datos de la transferencia
        const payload = {
            departamento_id: selectedDepartamento.value.id,
            municipio_id: selectedMunicipio.value.id,
            poblacion_id: selectedPoblacion.value.id,
            cobertura: transferencia.value.cobertura,
            poblacion: transferencia.value.poblacion
        };
        console.log(payload);
        // Llamar al servicio para guardar la problemática
        const { data } = await transferenciaService.guardarLocalizacion(transferencia.value.id, payload);

        // Mostrar mensaje de éxito o manejar la respuesta según sea necesario
        console.log(data);
        toast.add({ severity: 'success', summary: 'Guardar', detail: 'Se guardo correctamente', life: 3000 });
        //alert(data.message);
        //mensaje_loc.value = 'Registro guardado';
        // consoe.log("Transferencia", transferencia.value);
        // const response = await axios.post('/api/guardar-localizacion', transferencia.value);
        // console.log('Data saved successfully:', response.data);
    } catch (err) {
        error.value = 'Error saving data';
    }
};


const getPlanes = async () => {
    const { data } = await planService.index();

    planes.value = data;
    //alert(entidades.value);
};

const getAreas = async () => {
    const { data } = await areaService.index();

    areas.value = data;
    //alert(entidades.value);
};
// Fetch programas based on selected plan
const fetchProgramas = async (planId) => {
    
    console.log("Selected Plan ID***:", planId);
    try {
        //const response = await axios.get(`http://127.0.0.1:8000/api/programa/${planId}`);
        const { data } = await programaService.show(planId);
        programas.value = data;
    } catch (err) {
        error.value = 'Error fetching programas';
    }
};

// Handler when plan is changed
const onPlanChange = () => {
    // const selectedPlanId = transferencia.value.plan.id;
    const selectedPlanId = selectedPlan.value.id;
    console.log("Selected Plan ID:", selectedPlanId);
    if (selectedPlanId) {
        fetchProgramas(selectedPlanId);
    } else {
        programas.value = [];
    }
};

// Save problematica to database
/*const guardarProblematica = async () => {
    try {
        const response = await axios.post('/api/guardar-problematica', transferencia.value);
        console.log('Problematica guardada exitosamente:', response.data);
    } catch (err) {
        error.value = 'Error al guardar problematica';
    }
};*/

async function guardarProblematica() {
    try {
        // Crear el payload con los datos de la transferencia
        const payload = {
            // plan_id: transferencia.value.plan.id,
            plan_id: selectedPlan.value.id,
            // programa_id: transferencia.value.programa.id,
            programa_id: selectedPrograma.value.id,
            descripcion: transferencia.value.descripcion
        };

        // Llamar al servicio para guardar la problemática
        const { data } = await transferenciaService.guardarProblematica(transferencia.value.id, payload);

        // Mostrar mensaje de éxito o manejar la respuesta según sea necesario
        console.log(data.message);
       // alert(data.message);
        //mensaje_prob.value = 'Registro guardado';
        toast.add({ severity: 'success', summary: 'Guardar', detail: 'Se guardo correctamente', life: 3000 });

    } catch (error) {
        //console.error("Error al guardar la problemática:", error);
    }
}



// Fetch municipios based on departamento
const fetchMunicipios = async (departamentoId) => {
    try {
        const response = await axios.get(`/api/municipios/${departamentoId}`);
        municipios.value = response.data;
        poblaciones.value = []; // Reset poblaciones when departamento changes
    } catch (err) {
        //error.value = 'Error fetching municipios';
    }
};

// Fetch poblaciones based on municipio
const fetchPoblaciones = async (municipioId) => {
    try {
        const response = await axios.get(`/api/poblaciones/${municipioId}`);
        poblaciones.value = response.data;
    } catch (err) {
        //error.value = 'Error fetching poblaciones';
    }
};

// Watcher for departamento change
watch(() => transferencia.value.departamento, (newDepartamento) => {
    if (newDepartamento) {
        fetchMunicipios(newDepartamento.id);
    } else {
        municipios.value = [];
        poblaciones.value = [];
    }
});

// Watcher for municipio change
watch(() => transferencia.value.municipio, (newMunicipio) => {
    if (newMunicipio) {
        fetchPoblaciones(newMunicipio.id);
    } else {
        poblaciones.value = [];
    }
});



function updateFechaInicio(value) {
    this.fecha_inicio = value;
};
/*
const getEntidades = async () => {
    const { data } = await entidadService.index();

    entidades.value = data;
    //alert(entidades.value);
};*/

//const formKey = ref(0); // Clave reactiva que forzará la recarga del formulario
// Función para obtener la entidad ejecutora desde el LocalStorage y el API
const obtenerEntidadEjecutora = async () => {
    const storedEntidadId = localStorage.getItem('entidad_id');
    
    if (storedEntidadId) {
        entidadId.value = storedEntidadId;

        try {
            const { data } = await entidadService.show(entidadId.value);
            entidades.value = data;
        } catch (error) {
            console.error('Error al obtener los datos de la entidad:', error);
        }
    } else {
        console.warn('No se encontró entidad_id en el LocalStorage.');
    }
};

// Función para actualizar el valor de entidadId, guardarlo en el LocalStorage y recargar el formulario
const actualizarEntidadId = () => {
    localStorage.setItem('entidad_id', entidadId.value); // Actualiza el LocalStorage
   
};

// Función para actualizar el valor de entidadId y guardarlo en el LocalStorage
const updateEntidadId = () => {
    localStorage.setItem('entidad_id', entidadId.value); // Actualiza el LocalStorage
};
/*
const obtenerEntidadEjecutora = async () => {
    entidadId.value = localStorage.getItem('entidad_id');
    const { data } = await entidadService.show(entidadId.value);

    entidades.value = data;
};*/

function obtenerEntidad() {
    fetch("http://127.0.0.1:8000/api/entidad")
        .then((respuesta) => respuesta.json())
        .then((json) => (entidad.value = json));
}

//listar transferencias
const getTransferencias = async () => {
    // Obtener entidad_id desde el localStorage
    const entidadId = ref(localStorage.getItem('entidad_id'));
  
    const { data } = await transferenciaService.index(entidadId.value);

    for (let i = 0; i < data.length; i++) {
        data[i].fecha_inicio = formatDateVista(data[i].fecha_inicio);
        data[i].fecha_termino = formatDateVista(data[i].fecha_termino);
    }

    transferencias.value = data;

    if (transferencia.value.plan) {
        plan.value.plan = transferencia.value.plan;
    }

    if (transferencia.value.programa) {
        programa.value.programa = transferencia.value.programa;
    }
    //alert(transferencias);
};

function mostrarDatosPersonales(transferencia) {
    transferencia.value = {};
    visibleDialogTransferencia.value = true;
    //alert("ffggggfgfggffg");
    //usuario_id.value = user.id;
    //if(user.persona){
    //    persona.value = user.persona
    //}
}

function funEditar(user) {
    usuario.value = user;
}


async function editTransferencia(transferenciaData) {
    try {
        isEdit.value = true;
        const { data } = await transferenciaService.show(transferenciaData.id);
        transferencia.value = data;
        //obtiene programas
        await fetchProgramas(transferencia.value[0].plan_id);
        //obtiene municipios y poblaciones
        await cargarMunicipios(transferencia.value[0].departamento);
        await cargarPoblaciones(transferencia.value[0].municipio);
        console.log("ID Ent",transferencia.value[0].entidad_ejecutora);
        transferencia.value.fecha_inicio=transferencia.value.fecha_inicio;
        selectedEntidad.value = entidades.value.find(ent => ent.id === transferencia.value[0].entidad_operadora_id);
        //selectedEntidad.value = entidades.value.find(ent => ent.nombre === transferencia.value[0].entidad_operadora);
        selectedEntidadNombre.value = transferencia.value[0].entidad_ejecutora;
        originalNombre.value = transferencia.value[0].entidad_ejecutora;
        selectedArea.value = areas.value.find(area => area.id === transferencia.value[0].area_id);
        selectedPlan.value = planes.value.find(plan => plan.id === transferencia.value[0].plan_id);
        selectedPrograma.value = programas.value.find(programa => programa.id === transferencia.value[0].programa_id);
        selectedDepartamento.value = departamentos.value.find(departamento => departamento.id === transferencia.value[0].departamento);
        selectedMunicipio.value = municipios.value.find(municipio => municipio.id === transferencia.value[0].municipio);
        selectedPoblacion.value = poblaciones.value.find(poblacion => poblacion.id === transferencia.value[0].poblacion_id);
        //formatear fecha
        for (let i = 0; i < data.length; i++) {
            data[i].fecha_inicio = formatDateVista(data[i].fecha_inicio);
            data[i].fecha_termino = formatDateVista(data[i].fecha_termino);
        }
    // Asignar el responsable de la operación basado en la entidad
    //selectedEntidad.value = entidades.value.find(ent => ent.nombre === transferencia.value.responsable_ejecucion);
    // Asignar el nombre de la entidad seleccionada
        // selectedEntidadNombre.value = data[0]["responsable_ejecucion"];
        Object.assign(transferencia.value, data[0]);
        visibleDialogTransferencia.value = true;
    } catch (err) {
        error.value = 'Error al cargar los datos de la transferencia.';
    }
}

function openNew() {
    //obtiene entidad segun el id de entidad
    obtenerEntidadEjecutora();
    transferencia.value = {};
    selectedEntidad.value = {};
    selectedArea.value = {};
    submitted.value = false;
    transferenciaDialog.value = true;
}

function hideDialog() {
    transferenciaDialog.value = false;
    submitted.value = false;
}

watch(selectedEntidad, (newVal) => {
    if (newVal) {
        if(isEdit.value === true){
            selectedEntidadNombre.value = originalNombre.value;
            isEdit.value = false;
        } else {
            selectedEntidadNombre.value = newVal.nombre;
        }
    } else {
        selectedEntidadNombre.value = originalNombre.value;
    }
});

function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function validarFechasYGuardar() {
    
    // Accede a las fechas desde el objeto 'transferencia'
    let fechaInicio = transferencia.value.fecha_inicio;
    let fechaTermino = transferencia.value.fecha_termino;
    // alert(fechaInicio);
    // alert(fechaTermino);
    // Verifica que ambas fechas estén presentes
    if (!fechaInicio || !fechaTermino) {
        error = 'Ambas fechas son obligatorias.';
        return;
    }

    // Formatea las fechas a dd/mm/aaaa
    fechaInicio = formatDateToDDMMYYYY(fechaInicio);
    fechaTermino = formatDateToDDMMYYYY(fechaTermino);
    // alert(fechaInicio);
    // alert(fechaTermino);
    // Compara las fechas (convertidas a formato 'yyyy-mm-dd' para comparación)
    const fechaInicioISO = new Date(fechaInicio.split('/').reverse().join('-'));
    const fechaTerminoISO = new Date(fechaTermino.split('/').reverse().join('-'));
    //actulizarTransferencia();
    saveTransferenciaUpdate();
    //console.log('Problematica guardada exitosamente:');

}

const denominacionError = ref(false);

const validateDenominacion = () => {
  denominacionError.value = transferencia.denominacion_convenio.length > 110;
  if (denominacionError.value) {
    transferencia.denominacion_convenio = transferencia.denominacion_convenio.slice(0, 110);
  }
};



async function saveTransferenciaUpdate() {


    try {
        // Asignación de los valores a la transferencia
        transferencia.value.nombre_tpp = nombreTpp.value;
        transferencia.value.entidad_operadora_id = selectedEntidad.value.id;
        transferencia.value.entidad_ejecutora = selectedEntidadNombre.value;
        transferencia.value.area_id = selectedArea.value.id;
        // transferencia.value.area_id = transferencia.area_id;
        // transferencia.value.fecha_inicio = transferencia.fechaInicio;
        // transferencia.value.fecha_termino = transferencia.fechaTermino;


        const transferenciaData = { ...transferencia.value };
       // alert(transferenciaData);
        // Envío de la solicitud al servicio
        const { data } = await transferenciaService.actualizarTranferencia(transferencia.value.id,transferenciaData);
        // Actualizar la lista de transferencias
        getTransferencias();
        // Marcar el formulario como enviado y cerrar el diálogo
        submitted.value = true;
        mensaje.value = 'Registro guardado';
        toast.add({ severity: 'success', summary: 'Guardar', detail: 'Se guardo el registro', life: 3000 });
        console.log('Problematica guardada exitosamente:');
        // transferenciaDialog.value = false;
        // visibleDialogTransferencia.value = false;

        // Limpiar los valores de la transferencia
        // transferencia.value = {};
    } catch (error) {
        console.error("Error guardando la transferencia:", error);
        // Aquí puedes mostrar un mensaje de error al usuario si es necesario
    }
}

function validarFechas() {
    //alert(fecha_inicio.value);
    const fechaInicio = formatDate(fecha_inicio.value);
    const fechaTermino = formatDate(fecha_termino.value);
    //alert(fechaInicio);
    //alert(fechaTermino);
    if (!fecha_inicio.value || !fecha_termino.value) {
        error.value = 'Ambas fechas son obligatorias.';
        return;
    }

    //const fechaTermino = parseDate(fecha_termino.value);
    //const fechaInicio = fecha_inicio.value;
    //const fechaTermino = fecha_termino.value;

    if (fechaTermino <= fechaInicio) {
        error.value = 'La fecha de término debe ser al menos un día después de la fecha de inicio.';
    } else {
        error.value = '';
        // Lógica para guardar los datos
        saveTransferencia();
    }
}

function formatDate(date) {

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
/*
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
}*/
function actulizarTransferencia() {
  // Validar que todos los campos requeridos estén completos
  if (!transferencia.value.entidad_operadora || !transferencia.value.entidad_ejecutora ||
      !transferencia.value.codigo_tpp || !transferencia.value.objeto ||
      !transferencia.value.localizacion || !transferencia.value.nombre_tpp ||
      !transferencia.value.denominacion_convenio || !transferencia.value.id_area ||
      !transferencia.value.fecha_inicio || !transferencia.value.fecha_termino) {
    error.value = 'Todos los campos son obligatorios.';
    return;
  }

  // Simular una solicitud de guardado a un servidor
  const payload = {
    entidad_operadora: transferencia.value.entidad_operadora,
    entidad_ejecutora: transferencia.value.entidad_ejecutora,
    codigo_tpp: transferencia.value.codigo_tpp,
    objeto: transferencia.value.objeto,
    localizacion: transferencia.value.localizacion,
    nombre_tpp: transferencia.value.nombre_tpp,
    denominacion_convenio: transferencia.value.denominacion_convenio,
    id_area: transferencia.value.id_area,
    fecha_inicio: convertirFecha(transferencia.value.fecha_inicio), // Convertir a formato YYYY-MM-DD
    fecha_termino: convertirFecha(transferencia.value.fecha_termino), // Convertir a formato YYYY-MM-DD
  };

  console.log('Guardando datos:', payload);

  // Simular el guardado exitoso (reemplazar con una solicitud real)
  setTimeout(() => {
    console.log('Datos guardados exitosamente:', payload);
    error.value = ''; // Limpiar cualquier error previo
    alert('Los datos se han guardado exitosamente.');
  }, 1000);


}



async function saveTransferencia() {
    // Recuperar el codigo_presupuestario desde localStorage
    const codigoPresupuestario = localStorage.getItem('codigo_presupuestario');
    try {
        // Asignación de los valores a la transferencia
        transferencia.value.nombre_tpp = nombreTpp.value;
        transferencia.value.entidad_operadora_id = selectedEntidad.value.id;
        console.log("Entidad Ejecutora:",selectedEntidad.value.nombre);
        transferencia.value.entidad_ejecutora = selectedEntidad.value.nombre;
        transferencia.value.id_area = selectedArea.value.id;
        //transferencia.value.localizacion = localizacion;
        transferencia.value.fecha_inicio = fecha_inicio;
        transferencia.value.fecha_termino = fecha_termino;
        transferencia.value.codigo_presupuestario = codigoPresupuestario
        //alert("ggggg"+transferencia.value);
        console.log("Guardar transferencia",transferencia.value);
        // Envío de la solicitud al servicio
        const { data } = await transferenciaService.store(transferencia.value);

        // Actualizar la lista de transferencias
        getTransferencias();

        // Marcar el formulario como enviado y cerrar el diálogo
        submitted.value = true;
        transferenciaDialog.value = false;

        // Limpiar los valores de la transferencia
        transferencia.value = {};

    } catch (error) {
        console.error("Error guardando la transferencia:", error);

        // Comprobar si el error tiene una respuesta del servidor (caso común en Axios)
        if (error.response) {
            console.error("Respuesta del servidor:", error.response);
            console.error("Datos del error:", error.response.data);
            console.error("Estado del error:", error.response.status);
        } else if (error.request) {
            // El cliente hizo la solicitud pero no recibió respuesta
            console.error("No hubo respuesta del servidor:", error.request);
        } else {
            // Algo ocurrió al configurar la solicitud
            console.error("Error al configurar la solicitud:", error.message);
        }

        // Mostrar un mensaje de error al usuario
        alert('Ocurrió un error al guardar la transferencia. Por favor, intenta nuevamente denominacion tiene mas de 110 caracteres.');
    }
}


function confirmDeleteTransferencia(prod) {
    transferencia.value = prod;
    deleteTransferenciaDialog.value = true;
}

async function deleteTransferencia() {
    //transferencias.value = transferencias.value.filter((val) => val.id !== transferencia.value.id);
    const { data } = await transferenciaService.destroy(transferencia.value.id)
    deleteTransferenciaDialog.value = false;
    transferencia.value = {};
    getTransferencias();
    //toast.add({ severity: 'success', summary: 'Successful', detail: 'transferencia Deleted', life: 3000 });
}
</script>
