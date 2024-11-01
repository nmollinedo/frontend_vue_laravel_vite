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
            <ProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".5s"
            aria-label="Custom ProgressSpinner"
            v-if="loading"
            />
            <Toolbar class="mb-6" style="display: flex; justify-content: space-between;">
                <!-- Botón de "Nuevo transferencia" alineado a la izquierda -->
                <template #start>
                <Button label="Nuevo transferencia" icon="pi pi-plus" severity="secondary" class="mr-2"
                    @click="nuevaTransferencia" />
                </template>
                <!-- Botón "Actualizar Tabla" alineado a la derecha -->
                <template #end>
                <button @click="actualizarTabla" class="p-button p-button-secondary">
                    Actualizar Tabla
                </button>
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

            <!--   <Column field="id" header="COD" sortable style="min-width: 1rem"></Column> -->
                <Column field="codigo_tpp" header="CODIGO" sortable style="min-width: 7rem"></Column>
                <Column field="nombre_formal" header="NOMBRES" sortable class="fixed-column"></Column>
                
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
         
         <!-- Se reduce el espaciado entre los elementos a gap-2 -->
         <div class="flex flex-col gap-2">
             <Fieldset legend="">
                 <td>
                     <label for="Entidad" class="block font-bold mb-2">Responsable de la operacion</label>
                 </td>
                 <div>
                     <Dropdown v-model="selectedEntidad" :options="entidades" optionLabel="nombre"
                         placeholder="Seleccionar una entidad" class="w-full md:w-14rem" />
                 </div>
                 <div>
                     <label for="responsableEjecucion" class="block font-bold mb-2">Responsable de la ejecucion</label>
                     <InputText v-model="selectedEntidadNombre" id="responsableEjecucion" fluid />
                 </div>
             </Fieldset>
 
             <div class="grid grid-cols-10 gap-1">
                 <div class="col-span-2">
                     <label for="price" class="block font-bold mb-2">Codigo TPP</label>
                 </div>
                 <div class="col-span-2">
                     <InputText id="codigo_tpp1" value='TPP' integeronly fluid disabled />
                 </div>
                 <div class="col-span-2">
                     <InputText id="codigo_tpp2" value='0000' integeronly fluid disabled />
                 </div>
                 <div class="col-span-2">
                     <InputText id="codigo_tpp" value='0000000' integeronly fluid disabled />
                 </div>
             </div>
             
             <div>
                 <label for="objeto" class="block font-bold mb-2">Objeto</label>
                 <InputText id="objeto" v-model.trim="transferencia.objeto" required="true" fluid />
             </div>
             
             <div>
                 <label for="localizacion" class="block font-bold mb-2">Localización</label>
                 <InputText id="localizacion" v-model.trim="transferencia.localizacion" required="true" fluid />
             </div>
 
             <div>
                 <label for="nombre_tpp" class="block font-bold mb-2">Nombre TPP</label>
                 <InputText id="nombre_tpp" v-model="nombreTpp" @input="validateNombreTpp" fluid disabled />
                 <span v-if="nombreTppError" class="text-red-110">Máximo 110 caracteres permitidos</span>
             </div>
 
             <div>
                 <label for="denominacion_convenio" class="block font-bold mb-2">Denominación del Convenio</label>
                 <Textarea id="denominacion_convenio" v-model="transferencia.denominacion_convenio" rows="4" fluid />
             </div>
 
             <div>
                 <label for="Entidad" class="block font-bold mb-2">Área de Influencia</label>
                 <Dropdown v-model="selectedArea" :options="areas" optionLabel="descrip_area" placeholder="Seleccione una área" class="w-full md:w-14rem" />
             </div>
 
             <div>
                 <label for="fecha_inicio" class="block font-bold mb-2">Fecha Inicio</label>
                 <Calendar v-model="fecha_inicio" dateFormat="dd/mm/yy" showIcon />
             </div>
 
             <div>
                 <label for="fecha_termino" class="block font-bold mb-2">Fecha Termino</label>
                 <Calendar v-model="fecha_termino" dateFormat="dd/mm/yy" showIcon />
             </div>
         </div>
 
         <div v-if="error" class="text-red-500">{{ error }}</div>
 
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



    <Dialog v-model:visible="visibleDialogTransferencia" modal header="Actualizar Datos" :style="{ width: '78rem' }">
        <!--    <div class="p-6">
        <p>Codigo TPP: <span class="text-lg font-medium text-gray-900">{{  }}</span></p>
        <p>Nombre: <span class="text-lg font-medium text-gray-900">{{  }}</span></p>
        </div>
  {{ transferencia }}   -->
        

        <div class="mt-6 mb-6 space-y-6" style="max-width: 1050px; margin-top: 20px; margin-bottom: 20px;">

            <basic-tabs class="mt-6 mb-6 space-y-6 " style="max-width: 1050px; margin-top: 20px; margin-bottom: 20px;">
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
                    <!--    <div>
                            <label for="nombre_tpp">Nombre TPP</label>
                            <InputText id="nombre_tpp" :value="nombreTpp" readonly fluid />
                        </div> -->
                        <div>
                            <label for="nombre_tpp">Nombre TPP</label>
                           
                            <InputText id="nombre_tpp" v-model="nombreTpp" @input="validateNombreTpp" fluid />

                            <!-- Mostrar el mensaje de error si excede los 110 caracteres -->
                            <span v-if="nombreTppError" class="text-red-110">
                            Máximo 110 caracteres permitidos
                            </span>
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
                            <Calendar v-model="transferencia.fecha_inicio" dateFormat="dd-mm-yy" showIcon />
                        </div>

                        <div>
                            <label for="fecha_termino" class="block font-bold mb-3">Fecha Término</label>
                            <Calendar v-model="transferencia.fecha_termino" dateFormat="dd-mm-yy" showIcon />
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
                        <div v-if="mensaje_loc" class="text-green-500">
                        {{ mensaje_loc }}
                        </div> 
                        <Toast />
                    </div>
                    <Toast />
                    
                    <Button label="Guardar datos" icon="pi pi-check" @click="validarFechasYGuardar"
                        style="background-color: #1e88e5; border-color: #1e88e5; color: #fff;" />
                </basic-tab>

                <basic-tab title="Problematica  "> <!--{{ transferencia }}-->
                    <div class="flex flex-col gap-6"> <!--{{ planes }} -->
                        <Fieldset legend="">
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

                <basic-tab title="Localizacion geografica">
                    <!-- Verifica si el campo descripción (problemática) está vacío antes de habilitar los campos de localización -->
                    <div v-if="transferencia.descripcion && transferencia.descripcion.length > 0" class="flex flex-col gap-6">
                        <Fieldset legend="">
                        <label for="Departamento" class="block font-bold mb-3">Departamento</label>
                        <Dropdown 
                            v-model="selectedDepartamento" 
                            :options="departamentos" 
                            optionLabel="descrip_departamento"
                            placeholder="Seleccione departamento" 
                            class="w-full md:w-14rem" 
                            @change="onDepartamentoChange"
                        />
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
                        <div>
                        <label for="descripcion" class="block font-bold mb-3">Poblacion Beneficiada</label>
                        <InputNumber v-model="transferencia.poblacion" inputId="integeronly" fluid />
                        </div>
                        <div>
                           
                            <a href="#" @click.prevent="showDialog = true">Abrir mapa</a>

                         
                            <Button label="Mapa" icon="pi pi-external-link" @click="showDialog = true" />

                          
                            <Dialog v-model:visible="showDialog" header="Mapa" :style="{ width: '50vw' }">
                            <p>.</p>
                            <Recurso />
                            <Button label="Close" icon="pi pi-times" @click="showDialog = false" />
                            </Dialog>
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

                    <!-- Mensaje cuando el campo problemática no está lleno -->
                    <div v-else>
                        <p class="text-red-500">Por favor, complete la descripción del problema antes de llenar la localización geográfica.</p>
                    </div>
                    </basic-tab>

                    
                <basic-tab title="Componente">
                    <!--
                        <div>
                            <h2>Costo de la Etapa (Expresado en Bolivianos)</h2>
                            <p>Ejecución reportada a la fecha: {{ reportedExecution.toFixed(2) }}</p>
                            <div class="button-row">
                            <Button label="Adicionar Componente" icon="pi pi-plus" @click="addComponent" class="p-button-secondary" />
                            </div>
                            <DataTable :value="costItems" >
                            <Column field="component" header="Componentes Etapa">
                                <template #body="slotProps">
                                <div v-if="slotProps.data.isEditing">
                                    <Dropdown v-model="slotProps.data.component" :options="predefinedComponents" optionLabel="name" placeholder="Seleccione un componente" @change="(e) => onComponentChange(e, slotProps.data)">
                                    <template #option="slotProps">
                                        <div>{{ slotProps.option.name }}</div>
                                    </template>
                                    </Dropdown>
                                    <InputText v-if="slotProps.data.component === ''" v-model="slotProps.data.component" placeholder="Ingrese componente personalizado" />
                                </div>
                                <span v-else>{{ slotProps.data.component }}</span>
                                </template>
                            </Column>
                            <Column field="ownContribution" header="Aporte Propio (Bs.)">
                                <template #body="slotProps">
                                <InputNumber v-if="slotProps.data.isEditing" v-model="slotProps.data.ownContribution" @input="calculateTotal(slotProps.data)" />
                                <span v-else>{{ slotProps.data.ownContribution }}</span>
                                </template>
                            </Column>
                            <Column field="coFinancing" header="Co-Finan./Transf.(Bs.)">
                                <template #body="slotProps">
                                <InputNumber v-if="slotProps.data.isEditing" v-model="slotProps.data.coFinancing" @input="calculateTotal(slotProps.data)" />
                                <span v-else>{{ slotProps.data.coFinancing }}</span>
                                </template>
                            </Column>
                            <Column field="externalFinancing" header="Finan. Externo (Bs.)">
                                <template #body="slotProps">
                                <InputNumber v-if="slotProps.data.isEditing" v-model="slotProps.data.externalFinancing" @input="calculateTotal(slotProps.data)" />
                                <span v-else>{{ slotProps.data.externalFinancing }}</span>
                                </template>
                            </Column>
                            <Column field="others" header="Otros (Bs.)">
                                <template #body="slotProps">
                                <InputNumber v-if="slotProps.data.isEditing" v-model="slotProps.data.others" @input="calculateTotal(slotProps.data)" />
                                <span v-else>{{ slotProps.data.others }}</span>
                                </template>
                            </Column>
                            <Column field="noFinancing" header="Sin Finan.(Bs.)">
                                <template #body="slotProps">
                                <InputNumber v-if="slotProps.data.isEditing" v-model="slotProps.data.noFinancing" @input="calculateTotal(slotProps.data)" />
                                <span v-else>{{ slotProps.data.noFinancing }}</span>
                                </template>
                            </Column>
                            <Column field="total" header="Total Etapa(Bs.)">
                                <template #body="slotProps">
                                {{ slotProps.data.total.toFixed(2) }}
                                </template>
                            </Column>
                            <Column>
                                <template #body="slotProps">
                                <div class="action-buttons">
                                    <Button v-if="slotProps.data.isEditing" icon="pi pi-check" class="p-button-rounded p-button-success p-button-text" @click="saveChanges(slotProps.data)" />
                                    <Button v-if="slotProps.data.isEditing" icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="cancelEditing(slotProps.data, slotProps.index)" />
                                    <Button v-if="!slotProps.data.isEditing" icon="pi pi-pencil" class="p-button-rounded p-button-text" @click="startEditing(slotProps.data)" />
                                    <Button v-if="!slotProps.data.isEditing" icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" @click="removeComponent(slotProps.data.id)" />
                                </div>
                                </template>
                            </Column>
                            
                                <template #footer>
                                <td class="total-cell">Total:</td>
                                <td class="total-cell">{{ getColumnTotal('aporte_propio') }}</td>
                                <td class="total-cell">{{ getColumnTotal('cofinanciamiento') }}</td>
                                <td class="total-cell">{{ getColumnTotal('finan_externo') }}</td>
                                <td class="total-cell">{{ getColumnTotal('otros') }}</td>
                            
                                <td class="total-cell">{{ getGrandTotal() }}</td>
                                <td class="total-cell"></td> 
                                </template>
                            </DataTable>
                            
                            <div class="total-row">
                            <strong>TOTAL</strong>
                            <span>{{ totalCost.toFixed(2) }}</span>
                            </div>
                        </div> -->
                       
                <!--    <div v-if="transferencia.descripcion && transferencia.descripcion.length > 0" class="flex flex-col gap-6">-->
                        <!-- <div  class="flex flex-col gap-6">    
                        <Fieldset legend="">
                        <label for="Componente" class="block font-bold mb-3">Componente</label>
                        <Dropdown 
                            v-model="selectedComponente" 
                            :options="componentes" 
                            optionLabel="componente"
                            placeholder="Seleccione componente" 
                            class="w-full md:w-14rem" 
                            
                        />
                       
                        </Fieldset>
                        <div>
                        <label for="monto_aporte_local" class="block font-bold mb-3">Aporte Propio (Bs.) </label>
                        <InputNumber v-model="componentes.monto_aporte_local" inputId="integeronly" fluid />
                        </div>
                        <div>
                        <label for="monto_cofinanciamiento" class="block font-bold mb-3">Co-Finan./Transf.(Bs.)</label>
                            <InputNumber v-model="componentes.monto_cofinanciamiento" inputId="integeronly" fluid />
                        </div>
                        <div>
                        <label for="monto_finan_externo" class="block font-bold mb-3">Finan. Externo (Bs.)</label>
                        <InputNumber v-model="componentes.monto_finan_externo" inputId="integeronly" fluid />
                        </div>
                        <div>
                        <label for="monto_otros" class="block font-bold mb-3">Otros (Bs.)</label>
                        <InputNumber v-model="componentes.monto_otros" inputId="integeronly" fluid />
                        </div>
                        <div v-if="mensaje_loc" class="text-green-500">
                        {{ mensaje_loc }}
                        </div> 
                        <Toast />
                        <Button 
                        label="Guardar componente" 
                        icon="pi pi-check" 
                        @click="guardarComponente"
                        style="background-color: #1e88e5; border-color: #1e88e5; color: #fff;" 
                        />
                    </div> -->
                    <Button 
                        label="Agregar componente" 
                        icon="pi pi-check" 
                        @click="adicionarComponente"
                        style="background-color: #1e88e5; border-color: #1e88e5; color: #fff;" 
                    />
                  
                    <!-- Mensaje cuando el campo problemática no está lleno -->
                <!--    <div v-else>
                        <p class="text-red-500">Por favor, complete la descripción del problema antes de llenar la localización geográfica.</p>
                    </div> -->
                    <div class="modal-content">
                        <h2>Información</h2>
                        <p>Para actualizar los valores, presiona la tecla Enter (↵) mientras estés editando cualquier campo. Esto recalculará automáticamente los totales.</p>
                    </div>
                    <div>
                        <DataTable :value="listaComponentes" responsiveLayout="scroll" editMode="row" @rowEditInit="onRowEditInit" @rowEditSave="onRowEditSave" @rowEditCancel="onRowEditCancel">
                            <!-- Columna Componentes Etapa -->
                            <Column field="componente" header="Componentes Etapa" :style="{ width: '150px' }">
                                <template #body="slotProps">
                                    <Dropdown 
                                        v-if="slotProps.data.nuevo"
                                        v-model="componenteSelecionado" 
                                        :options="componentes" 
                                        optionLabel="componente"
                                        placeholder="Seleccione componente" 
                                        class="custom-dropdown" 
                                        :disabled="!slotProps.data.nuevo"
                                    />
                                    <span v-else>{{ slotProps.data.componente }}</span>
                                </template>
                            </Column>

                            <!-- Columnas editables con InputNumber -->
                            <Column field="monto_aporte_local" header="Aporte Propio (Bs.)" :style="{ width: '140px' }" bodyStyle="text-align: center">
                                <template #body="slotProps">
                                    <InputNumber v-if="slotProps.data.editar || slotProps.data.nuevo" v-model="slotProps.data.monto_aporte_local" @input="calculateTotal(slotProps.data)" class="input-cell" :minFractionDigits="2" :maxFractionDigits="2" mode="decimal" />
                                    <span v-else>{{ formatearMiles(slotProps.data.monto_aporte_local) }}</span>
                                </template>
                            </Column>

                            <Column field="monto_cofinanciamiento" header="Co-Finan./Transf. (Bs.)" :style="{ width: '140px' }" bodyStyle="text-align: center">
                                <template #body="slotProps">
                                    <InputNumber v-if="slotProps.data.editar || slotProps.data.nuevo" v-model="slotProps.data.monto_cofinanciamiento" @input="calculateTotal(slotProps.data)" class="input-cell" :minFractionDigits="2" :maxFractionDigits="2" mode="decimal" />
                                    <span v-else>{{ formatearMiles(slotProps.data.monto_cofinanciamiento) }}</span>
                                </template>
                            </Column>

                            <Column field="monto_finan_externo" header="Finan. Externo (Bs.)" :style="{ width: '140px' }" bodyStyle="text-align: center">
                                <template #body="slotProps">
                                    <InputNumber v-if="slotProps.data.editar || slotProps.data.nuevo" v-model="slotProps.data.monto_finan_externo" @input="calculateTotal(slotProps.data)" class="input-cell" :minFractionDigits="2" :maxFractionDigits="2" mode="decimal" />
                                    <span v-else>{{ formatearMiles(slotProps.data.monto_finan_externo) }}</span>
                                </template>
                            </Column>

                            <Column field="monto_otros" header="Otros (Bs.)" :style="{ width: '140px' }" bodyStyle="text-align: center">
                                <template #body="slotProps">
                                    <InputNumber v-if="slotProps.data.editar || slotProps.data.nuevo" v-model="slotProps.data.monto_otros" @input="calculateTotal(slotProps.data)" class="input-cell" :minFractionDigits="2" :maxFractionDigits="2" mode="decimal" />
                                    <span v-else>{{ formatearMiles(slotProps.data.monto_otros) }}</span>
                                </template>
                            </Column>

                            <!-- Columna para mostrar el total de cada fila -->
                            <Column header="Total (Bs.)" :style="{ width: '150px' }" bodyStyle="text-align: center">
                                <template #body="slotProps">
                                    {{ formatCurrency(getRowTotal(slotProps.data)) }}
                                </template>
                            </Column>

                            <!-- Columna de acciones -->
                            <Column header="Acciones" :style="{ width: '150px' }">
                                <template #body="slotProps">
                                    <Button v-if="slotProps.data.editar" icon="pi pi-save" class="p-button-rounded p-button-success p-button-text" 
                                        @click="slotProps.data.nuevo ? guardarComponente(slotProps.data) : saveEdit(slotProps.data)" />
                                    <Button v-if="slotProps.data.editar" icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="cerrarEdicion(slotProps.data, index)" />
                                    <Button v-if="!slotProps.data.editar" icon="pi pi-pencil" class="p-button-rounded p-button-text" @click="comenzarEdicion(slotProps.data)" />
                                    <Button v-if="!slotProps.data.editar" icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" @click="deleteComponent(slotProps.data)" />
                                </template>
                            </Column>

                            <!-- Footer -->
                            <template #footer>
                                <tr>
                                    <td :style="{ width: '150px', textAlign: 'center' }">Total</td>
                                    <td :style="{ width: '150px', textAlign: 'center' }">{{ formatCurrency(getColumnTotal('monto_aporte_local')) }}</td>
                                    <td :style="{ width: '150px', textAlign: 'center' }">{{ formatCurrency(getColumnTotal('monto_cofinanciamiento')) }}</td>
                                    <td :style="{ width: '150px', textAlign: 'center' }">{{ formatCurrency(getColumnTotal('monto_finan_externo')) }}</td>
                                    <td :style="{ width: '150px', textAlign: 'center' }">{{ formatCurrency(getColumnTotal('monto_otros')) }}</td>
                                    <td :style="{ width: '150px', textAlign: 'center' }">{{ formatCurrency(getGrandTotal()) }}</td>
                                    <td :style="{ width: '150px', textAlign: 'center' }"></td>
                                </tr>
                            </template>
                        </DataTable>



                        <!-- Dialog para la edición -->
                        <!-- <Dialog header="Editar Componente" v-model:visible="editDialogVisible" :modal="true" :closable="false" :style="{ width: '400px' }">
                        <div class="p-field">
                            <label for="monto_aporte_local">Aporte Propio (Bs.)</label>
                            <InputNumber v-model="selectedComponent.monto_aporte_local" mode="decimal" :min="0" :step="0.01" :maxFractionDigits="2" />
                        </div>

                        <div class="p-field">
                            <label for="monto_cofinanciamiento">Co-Finan./Transf. (Bs.)</label>
                            <InputNumber v-model="selectedComponent.monto_cofinanciamiento" mode="decimal" :min="0" :step="0.01" :maxFractionDigits="2" />
                        </div>

                        <div class="p-field">
                            <label for="monto_finan_externo">Finan. Externo (Bs.)</label>
                            <InputNumber v-model="selectedComponent.monto_finan_externo" mode="decimal" :min="0" :step="0.01" :maxFractionDigits="2" />
                        </div>

                        <div class="p-field">
                            <label for="monto_otros">Otros (Bs.)</label>
                            <InputNumber v-model="selectedComponent.monto_otros" mode="decimal" :min="0" :step="0.01" :maxFractionDigits="2" />
                        </div>

                        <div class="p-dialog-footer">
                            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="cancelEdit" />
                            <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveEdit" />
                        </div>
                        </Dialog>  -->
                    </div> 
                </basic-tab> 


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
import { eventBus } from "../../../utils/eventBus";
import componenteService from "../../../services/componente.service";
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import moment from 'moment'
import Recurso from './../recurso/recurso.vue' // Import the Recurso component


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
const mensaje_fech = ref('');
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

    // Reactive state for dialog visibility
const showDialog = ref(false)

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

const loading = ref(true);
const objeto = ref('');
const localizacion = ref('');
//const submitted = ref(false);
const componentes = ref([]);
const listaComponentes = ref([]);
const componenteSelecionado = ref({ id: null });
const mostrarFormulario = ref(false);
const totalSuma = ref(0);
const esAbiertoComponente = ref(false);
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
    cargarComponente();
    listarComponentes();
 /*   const entidadId = localStorage.getItem('entidad_id');
  if (entidadId) {
    console.log("monment0",entidadId)
    loadTransferencias(entidadId);
  }  */
    //fetchProgramas();
});

// Función para formatear los números con separador de miles y dos decimales
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0.00';
  return value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function formatearMiles(numero) {
  return new Intl.NumberFormat('es-BO').format(numero);
}

// Obtener total por fila con formato
const getRowTotalFormatted = (data) => {
  const total = data.monto_aporte_local + data.monto_cofinanciamiento + data.monto_finan_externo + data.monto_otros;
  return formatCurrency(total);
};

const loadTransferencias = async (entidadId) => {
  try {
    console.log("load trans adentro",entidadId.value)
   // const var.value = entidadId.value;
    const { data } = await transferenciaService.index(entidadId.value);
    transferencias.value = data;
    //obtenerEntidadEjecutora();
  } catch (error) {
    console.error('Error al cargar las transferencias', error);
  }
};
// Escucha el evento 'entidadSeleccionada'
eventBus.on('entidadSeleccionada', (entidadId) => {
  loadTransferencias(entidadId);
});
// Computed para obtener el valor reactivo desde el store
const entidadId = ref([]);

const planes = ref([]);
const programas = ref([]);

// Función que se llama al hacer clic en el botón de actualizar
function actualizarTabla() {
    getTransferencias();
}

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

async function cargarComponente() {
  try {
    const { data } = await componenteService.index();
    componentes.value = data;
  } catch (error) {
    console.error("Error al cargar los departamentos:", error);
  }
};

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

// Funccion guarda componente
const guardarComponente = async (filaData) => {
    const selectedComponenteId = componenteSelecionado.value.id;
    console.log("Componente ID",selectedComponenteId)
    console.log("Transferencia ID",transferencia.value.id)
    console.log(" monto_aporte_local",filaData.monto_aporte_local)
    console.log(" monto_aporte_local",filaData.monto_cofinanciamiento)
    try {
        // Crear el payload con los datos de la transferencia
        const payload = {
            transferencia_id: transferencia.value.id,
            componente_id: componenteSelecionado.value.id,
            monto_aporte_local: filaData.monto_aporte_local,
            monto_cofinanciamiento: filaData.monto_cofinanciamiento,
            monto_finan_externo:filaData.monto_finan_externo,
            monto_otros:filaData.monto_otros,
        };
        console.log("envio componente",payload);
        // Llamar al servicio para guardar la problemática
        const { data } = await componenteService.store(payload);
        listarComponentes();
        // Mostrar mensaje de éxito o manejar la respuesta según sea necesario
        console.log(data);
        toast.add({ severity: 'success', summary: 'Guardar', detail: 'Se guardo correctamente', life: 3000 });
         // Limpiar el formulario después de guardar
         cargarComponente();
        //  limpiarFormularioComponente();
        //  noMostrarComponente();
         esAbiertoComponente.value = false;
    } catch (err) {
        error.value = 'Error saving data';
    }
};

const mostrarComponente = () => {
    mostrarFormulario.value = true;
}

const noMostrarComponente = () => {
    mostrarFormulario.value = false;
}

// Función para limpiar el formulario de componente
const limpiarFormularioComponente = () => {
    // componentes.value = {
    //     monto_aporte_local: null,
    //     monto_cofinanciamiento: null,
    //     monto_finan_externo: null,
    //     monto_otros: null,
    // };
    // selectedComponente.value = null;
    selectedComponent.value = {};
    totalSuma.value = 0;
};


const getPlanes = async () => {
    //const entidadId = ref(localStorage.getItem('entidad_id'));
    //console.log("Plan Id_ent",entidadId.value)
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
            console.log("entidad cod",data);
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
    
    try {
        loading.value = true;
        // Obtener entidad_id desde el localStorage
    const entidadId = ref(localStorage.getItem('entidad_id'));
    const codigoPresupuestario = localStorage.getItem('codigo_presupuestario');
    const { data } = await transferenciaService.index(entidadId.value);

    for (let i = 0; i < data.length; i++) {
        data[i].fecha_inicio = formatDateVista(data[i].fecha_inicio);
        data[i].fecha_termino = formatDateVista(data[i].fecha_termino);
    }

    transferencias.value = data;
    transferencias.value.codigo_presupuestario=codigoPresupuestario;

    if (transferencia.value.plan) {
        plan.value.plan = transferencia.value.plan;
    }

    if (transferencia.value.programa) {
        programa.value.programa = transferencia.value.programa;
    }
        loading.value = false;
        
    } catch (error) {
        alert("error al recuperar la lista de usuarios")
    }
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
        listarComponentes();
        cargarComponente();
    } catch (err) {
        error.value = 'Error al cargar los datos de la transferencia.';
    }
}

function nuevaTransferencia() {
    //obtiene entidad segun el id de entidad
    obtenerEntidadEjecutora();
    //const codigoPresupuestarioId=
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

// Definir las variables reactivas

const nombreTppError = ref(false);

// Función para validar la longitud del Nombre TPP
const validateNombreTpp = () => {
  // Verificar si el número de caracteres supera 110
  console.log("Longitud",nombreTpp.value.length);
  if (nombreTpp.value.length > 110) {
    nombreTppError.value = true; // Mostrar error si es mayor a 110
    nombreTpp.value = nombreTpp.value.slice(0, 110); // Recortar el valor a 110 caracteres
  } else {
    nombreTppError.value = false; // No hay error si está dentro del límite
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
        toast.add({ severity: 'error', summary: 'Error', detail: 'La fecha de término debe ser al menos un día después de la fecha de inicio.', life: 3000 });
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
    console.log("longitud",nombreTpp.value.length);
            if (nombreTpp.value.length > 110) {
            // Recortar el valor a 110 caracteres justo antes de guardar
            //nombreTpp.value = nombreTpp.value.slice(0, 110);
            // Mostrar un mensaje de error al usuario
            alert('Ocurrió un error al guardar la transferencia. Por favor, intenta nuevamente nombre TPP tiene mas de 110 caracteres.');
            alert('Se supera los 110 caracteres.');
            }else{
                try {
                    // Asignación de los valores a la transferencia
                    transferencia.value.nombre_tpp = nombreTpp.value;
                    transferencia.value.entidad_operadora_id = selectedEntidad.value.id;
                    console.log("Entidad ejecutora:",selectedEntidad.value.id);
                    console.log("Entidad Ejecutora:",selectedEntidad.value.nombre);
                    transferencia.value.entidad_ejecutora = selectedEntidad.value.nombre;
                    transferencia.value.id_area = selectedArea.value.id;
                    //transferencia.value.localizacion = localizacion;
                    transferencia.value.fecha_inicio = fecha_inicio;
                    transferencia.value.fecha_termino = fecha_termino;
                    transferencia.value.codigo_presupuestario = codigoPresupuestario
                    console.log("codigo presupuestario",transferencia.value.codigo_presupuestario);
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

                    
                }

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
/*
const componentes = ref([
  { componente: 'Administración', aporte_propio: 0, cofinanciamiento: 0, finan_externo: 0, otros: 1 },
  { componente: 'Auditoría', aporte_propio: 0, cofinanciamiento: 0, finan_externo: 10, otros: 0 },
  { componente: 'Gestión de Riesgo de Desastres', aporte_propio: 11, cofinanciamiento: 0, finan_externo: 0, otros: 0}
]);*/

//Listar componentes
const listarComponentes = async () => {
    console.log("componente", transferencia.value[0].id);

    try {
        const { data } = await componenteService.show(transferencia.value[0].id);
        console.log("data componentes", data);

        // Agregar la propiedad 'editar: false' a cada objeto del array 'data'
        listaComponentes.value = data.map(item => ({
            ...item,          // Mantener todas las propiedades originales del objeto
            editar: false,     // Añadir la propiedad 'editar' con valor false
            nuevo: false    // Añadir la propiedad 'nuevo' con valor false
        }));

    } catch (error) {
        alert("error al recuperar la lista de componentes");
    }
};


const onRowEditInit = (event) => {
  console.log('Iniciando edición', event.data);
  event.originalData = { ...event.data }; // Guardar una copia del original por si se cancela la edición
};
const onRowEditSave = async (event) => {
  console.log('Guardando cambios', event.data);
  try {
    // Llama al servicio para actualizar el componente en el backend
    await componenteService.update(event.data.id, event.data);
    console.log('Componente actualizado');
  } catch (error) {
    console.error('Error al guardar el componente:', error);
  }
};

const onRowEditCancel = (event) => {
  console.log('Cancelando edición', event.data);
  listaComponentes.value[event.index] = event.originalData; // Revertir los cambios
};

const deleteComponent1 = (rowData) => {
  const index = listaComponentes.value.indexOf(rowData);
  if (index !== -1) {
    listaComponentes.value.splice(index, 1);
  }
};
// Function to calculate row total
const getRowTotal = (rowData) => {
  const montoAporteLocal = parseFloat(rowData.monto_aporte_local) || 0;
  const montoCofinanciamiento = parseFloat(rowData.monto_cofinanciamiento) || 0;
  const montoFinanExterno = parseFloat(rowData.monto_finan_externo) || 0;
  const montoOtros = parseFloat(rowData.monto_otros) || 0;

  const total = montoAporteLocal + montoCofinanciamiento + montoFinanExterno + montoOtros;

  if (total === null || total === undefined) return '0.00';
  return total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getRowTotalSinFormato = (rowData) => {
  const montoAporteLocal = parseFloat(rowData.monto_aporte_local) || 0;
  const montoCofinanciamiento = parseFloat(rowData.monto_cofinanciamiento) || 0;
  const montoFinanExterno = parseFloat(rowData.monto_finan_externo) || 0;
  const montoOtros = parseFloat(rowData.monto_otros) || 0;

  const total = montoAporteLocal + montoCofinanciamiento + montoFinanExterno + montoOtros;

  return total
};

// Function to calculate total for a specific column
const getColumnTotal = (field) => {
    const total = listaComponentes.value.reduce((total, item) => {
    return total + (parseFloat(item[field]) || 0);
  }, 0);

  return parseFloat(total.toFixed(2)); // Devuelve el total con 2 decimales como número
};

// Function to calculate grand total (sum of totals for each row)
const getGrandTotal = () => {
  const total = listaComponentes.value.reduce((acc, item) => {
    return acc + parseFloat(getRowTotalSinFormato(item)) || 0;
  }, 0);

  return parseFloat(total); // Devuelve el total con 2 decimales como número
};



const updateTotal = (nuevoValor) => {
    // Inicializar la suma total con 0
    let valorSumar = 0;

    // Verifica si nuevoValor está definido y es un número
    if (nuevoValor !== undefined && nuevoValor !== null) {
        // Asigna nuevoValor solo si es un número
        valorSumar = parseFloat(nuevoValor.value) || 0; // Convierte a número y maneja NaN
        console.log("Valor a sumar:", nuevoValor); // Muestra el valor a sumar en la consola
    }

    // Calcula el total de los montos
    const total = 
        parseFloat(selectedComponent.value.monto_aporte_local || 0) +
        parseFloat(selectedComponent.value.monto_cofinanciamiento || 0) +
        parseFloat(selectedComponent.value.monto_finan_externo || 0) +
        parseFloat(selectedComponent.value.monto_otros || 0);

    console.log("Total de la suma:", total); // Muestra el total en la consola

    // Actualiza totalSuma sumando el total y el valor a sumar
    totalSuma.value = total + valorSumar;

    // Para verificar que totalSuma se actualiza correctamente
};


const editComponent = (rowData) => {
  console.log('Edit:', rowData);
  // Add logic for editing the row data
};

const deleteComponent = async(rowData) => {
  console.log('Delete:', rowData);
  console.log('Delete:', rowData.componente_id);
  const transferencia_id = rowData.transferencia_id;
  const componente_id = rowData.componente_id;
  try {
    
    const { data } = await componenteService.destroy(transferencia_id,componente_id);
    listarComponentes();
    cargarComponente();
    } catch (error) {
        alert("error al eliminar componentes")
    }
  // Add logic for deleting the row data
};


// Estado para manejar el componente seleccionado y la visibilidad del diálogo
const editDialogVisible = ref(false);
const selectedComponent = ref({});

// Función para abrir el diálogo con los datos seleccionados
const comenzarEdicion = (rowData) => {
    // componenteSelecionado.value = componentes.value.find(ent => ent.id === rowData.componente_id);
    rowData.editar = true; // Habilitar la edición

//   selectedComponent.value = { ...rowData }; // Copia los datos del componente
//   console.log("componentes",selectedComponent.value)
//   mostrarFormulario.value = true;
//   componentes.value = { ...rowData }; // Copia los datos del componente
//   updateTotal();
//   editDialogVisible.value = true; // Mostrar el diálogo
};

const cerrarEdicion = (rowData, index) => {
    if (rowData.transferencia_id === '') {
        esAbiertoComponente.value = false;
        listaComponentes.value.splice(index, 1)
    } else {
        rowData.editar = false; // Deshabilitar la edición
    }
};

const adicionarComponente = () => {
    componenteSelecionado.value = {};
    if(!esAbiertoComponente.value){
        esAbiertoComponente.value = true;
        listaComponentes.value.unshift({
            transferencia_id: '',
            componente_id: 0,
            monto_aporte_local: 0,
            monto_cofinanciamiento: 0,
            monto_finan_externo: 0,
            monto_otros: 0,
            editar: true,
            nuevo: true
        })
    }
}
// Función para guardar los cambios
const saveEdit = async(rowData) => {
    try {
    // Crear el payload con los datos del componente seleccionado
    const payload = {
      transferencia_id: rowData.transferencia_id,  // o el campo que corresponda
      componente_id: rowData.componente_id,       // ID del componente
      monto_aporte_local: rowData.monto_aporte_local,
      monto_cofinanciamiento: rowData.monto_cofinanciamiento,
      monto_finan_externo: rowData.monto_finan_externo,
      monto_otros: rowData.monto_otros,
    };
    console.log("dataFila",payload);

    // Llamada a la API para guardar los cambios (puedes usar POST o PUT según tu API)
    const response = await componenteService.modificarComponente(payload.transferencia_id, payload);
    
    // Si la respuesta es exitosa, actualizamos la lista localmente
    const index = listaComponentes.value.findIndex((item) => item.componente_id === selectedComponent.value.componente_id);
    if (index !== -1) {
      listaComponentes.value[index] = { ...selectedComponent.value }; // Actualizar los valores en la lista
    }

    // Mostrar mensaje de éxito
    toast.add({ severity: 'success', summary: 'Componente actualizado', detail: 'Se guardó correctamente', life: 3000 });

    // Cerrar el diálogo
    cerrarEdicion(rowData);
    // editDialogVisible.value = false;
    // limpiarFormularioComponente();
    // noMostrarComponente();
  } catch (error) {
    // Manejar el error, si ocurre
    console.error('Error al guardar los cambios:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el componente', life: 3000 });
  }
};

// Función para cancelar la edición
const cancelEdit = () => {
  selectedComponent.value = {}; // Limpiar el componente seleccionado
  editDialogVisible.value = false; // Cerrar el diálogo
};

/*

const costItems = ref([
  { id: 1, component: 'Administración', ownContribution: 0, coFinancing: 0, externalFinancing: 1, others: 1, noFinancing: 1, total: 3, isEditing: false },
  { id: 2, component: 'Auditoría', ownContribution: 0, coFinancing: 0, externalFinancing: 10, others: 0, noFinancing: 0, total: 10, isEditing: false },
  { id: 3, component: 'Gestión de Riesgo de Desastres', ownContribution: 11, coFinancing: 0, externalFinancing: 0, others: 0, noFinancing: 0, total: 11, isEditing: false },
])

const totalCost = ref(24)
const reportedExecution = ref(0)
let nextId = 4

const predefinedComponents = [
  { name: 'Administración', code: 'ADM' },
  { name: 'Auditoría', code: 'AUD' },
  { name: 'Gestión de Riesgo de Desastres', code: 'GRD' },
  { name: 'Infraestructura', code: 'INF' },
  { name: 'Equipamiento', code: 'EQP' },
  { name: 'Capacitación', code: 'CAP' },
  { name: 'Otro', code: 'OTR' }
]

// const calculateTotal = (item) => {
//   item.total = item.ownContribution + item.coFinancing + item.externalFinancing + item.others + item.noFinancing
//   totalCost.value = costItems.value.reduce((sum, item) => sum + item.total, 0)
// }

const addComponent = () => {
  costItems.value.push({
    id: nextId++,
    component: '',
    ownContribution: 0,
    coFinancing: 0,
    externalFinancing: 0,
    others: 0,
    noFinancing: 0,
    total: 0,
    isEditing: true
  })
}

const removeComponent = (id) => {
  const index = costItems.value.findIndex(item => item.id === id)
  if (index !== -1) {
    costItems.value.splice(index, 1)
    totalCost.value = costItems.value.reduce((sum, item) => sum + item.total, 0)
  }
}

const startEditing = (item) => {
  item.isEditing = true
}

const saveChanges = (item) => {
  item.isEditing = false
  calculateTotal(item)
  console.log('Saving changes for component:', item.component)
}

const cancelEditing = (item, index) => {
  if (item.component === '') {
    removeComponent(item.id)
  } else {
    item.isEditing = false
  }
}

const onComponentChange = (event, item) => {
  if (event.value === 'OTR') {
    item.component = ''
  } else {
    item.component = event.value.name
  }
}

*/
</script>

<style>
.custom-dropdown {
    width: 150px; /* Limitar el ancho al 10% */
}

/* Limitar el ancho del texto y aplicar el desbordamiento */
.custom-dropdown .p-dropdown-label {
    white-space: nowrap; /* Evitar que el texto se divida en varias líneas */
    overflow: hidden; /* Ocultar el contenido que desborda */
    text-overflow: ellipsis; /* Mostrar "..." para indicar que hay más texto */
    max-width: 100%; /* Asegúrate de que no exceda el ancho del contenedor */
}

.custom-dropdown .p-dropdown {
    width: 100%; /* Asegurarte de que el dropdown ocupe todo el contenedor */
    white-space: nowrap; /* Evitar que el texto se divida en varias líneas */
    overflow: hidden; /* Ocultar el contenido que desborda */
    text-overflow: ellipsis; /* Mostrar "..." para indicar que hay más texto */
    max-width: 100%; /* Asegúrate de que no exceda el ancho del contenedor */
}

.p-dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
}
.total-cell {
  padding: 0.5rem 3.0rem;  /* Ajustar los valores para más o menos espacio */
  text-align: right;     /* Alineación derecha para los totales */
  font-weight: bold;     /* Para resaltar los totales */
}

.total-cell:first-child {
  text-align: left;      /* El texto "Total:" alineado a la izquierda */
}

.fixed-column {
  width: 40rem; /* o usa 200px por ejemplo */
  max-width: 40rem;
  min-width: 40rem;
  overflow: hidden; /* Para evitar que el contenido desborde */
}

.cost-form {
  max-width: 1000px;
  margin: 0 auto;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-weight: bold;
}

.button-row {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 1rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}


.input-cell input {
    max-width: 120px;        /* Limita el ancho a 80px */
    text-align: right;     /* Alinear texto a la derecha */
}

.modal-content {
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  text-align: left;
}

</style>
