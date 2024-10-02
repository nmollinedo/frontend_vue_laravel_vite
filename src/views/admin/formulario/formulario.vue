<template>
  <div >
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
  :value="transferencias" 
  paginator 
  :rows="5" 
  :rowsPerPageOptions="[5, 10, 20]" 
  responsiveLayout="scroll"
  style="width: 100%; max-width: 1500px;"
>
  <!-- Encabezado personalizado -->
  <template #header>
    <div>
      <h2>Transferencias</h2> 
    </div>
  </template>

  <Column field="codigo_tpp" header="CÓDIGO TPP" sortable></Column>
  <Column field="nombre_formal" header="Nombre" sortable></Column>
  <Column field="fecha_inicio" header="Fecha Inicio" sortable></Column>
  <Column field="fecha_termino" header="Fecha Término" sortable></Column>
  <Column field="clasificacion" header="Clasificación" sortable></Column>
  <Column field="bloqueo_proyecto" header="Clasificación" sortable></Column>
  <Column field="entidad" header="Ent." sortable></Column>
  <Column field="estado" header="Estado" sortable></Column>

  <Column header="Acciones">
    <!-- Template para definir las acciones dentro de cada fila -->
    <template #body="slotProps">
      <!-- Mostrar el valor de la función hasTransferencia -->
      <div>
        <p>Has transferencia: {{ transferenciaStatus[slotProps.data.id] }}</p>
      </div>
      
      <!-- Botón "Ver Formulario" siempre disponible -->
      <Button 
        label="Ver Formulario" 
        icon="pi pi-eye" 
        @click="abrirModalVer(slotProps.data.id,slotProps.data)" 
        class="p-button-text" 
      />

      <!-- Lógica para mostrar "Agregar" o "Activar" para cada fila -->
      <Button 
        v-if="!transferenciaStatus[slotProps.data.id]" 
        label="Agregar" 
        icon="pi pi-plus" 
        @click="abrirModal(slotProps.data.id,slotProps.data)" 
        class="p-button-text" 
      />
      <Button 
        v-if="slotProps.data.estado_id===2" 
        label="Agregar modificacion" 
        icon="pi pi-plus" 
        @click="abrirModalModificacion(slotProps.data.id,slotProps.data)" 
        class="p-button-text" 
         style="color: blue"
      />
      
      <!-- Botón "Activar" cuando ya existe un registro  para analista
      <Button 
        v-else-if="slotProps.data.bloqueo_proyecto===1" 
        label="Activar" 
        icon="pi pi-unlock" 
        @click="activarCierre(slotProps.data.id)" 
        class="p-button-text" 
      />-->
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
                label="Editar Fomulario.." 
                icon="pi pi-pencil" 
                @click="toggleDictamen(slotProps.data.id)" 
                class="p-button-text" />
                
            </template>
            
          </Column>
        </DataTable>
      </div>

      <Dialog :visible="mostrarModalVer" modal :style="{ width: '80vw' }" :draggable="false" :closable="false">
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
              <h3>Lista de formularios: </h3>

              <!-- DataTable de PrimeVue para mostrar los dictámenes -->
              <DataTable :value="dictamenes"  class="p-mt-4">
                
                <Column header="Ver" body="verTemplate"></Column>
                <Column field="transferencia_id" body="Id"></Column>
                <Column field="dictamen_id" body="Id"></Column>
                <Column field="tipo_dictamen" header="Tipo de formulario"></Column>
              <!--  <Column field="etapa" header="Etapa"></Column> -->
                <Column field="fecha_dictamen" header="Fecha formulario"></Column>
                <Column field="etapa_fecha_inicio" header="Fecha Inicio Etapa"></Column>
                <Column field="etapa_fecha_fin" header="Fecha Termino Etapa"></Column>
                <Column field="usuario_cierre" header="Usuario Cierre"></Column>
                <Column header="Imprimir" body="imprimirTemplate">
                  <template #body="slotProps">
                  <Button 
                      label="Imprimir" 
                      icon="pi pi-print" 
                      @click="abrirModalEditttt(slotProps.data.dictamen_id)" 
                      class="p-button-text" />
                    </template>   
                </Column>
                <Column header="Acciones">
                  <template #body="slotProps">
                    <Button 
                    v-if="slotProps.data.cierre_entidad!==1"
                      label="Editar" 
                      icon="pi pi-pencil" 
                      @click="abrirModalEdit(slotProps.data.dictamen_id)" 
                      class="p-button-text" />

                   <!--   <Button 
                    v-if="slotProps.data.cierre_entidad!==1"
                      label="Cierre" 
                      icon="pi pi-pencil" 
                      @click="abrirModalCierre(slotProps.data)" 
                      class="p-button-text" />-->
                      <Button 
                            v-if="slotProps.data.bloqueo_proyecto===0" 
                            label="Cierra Form"
                            icon="pi pi-lock-open" 
                            @click="abrirModalCierre(slotProps.data)"
                            class="p-button-text" />
                            
                            <Button 
                            v-if="slotProps.data.cierre_entidad!==1"
                            label="Cierra Form"
                            icon="pi pi-lock-open" 
                            @click="abrirModalCierre(slotProps.data)"
                            class="p-button-text" />      
                      <Button 
                            v-if="slotProps.data.cierre_entidad!==1"
                            icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteFormulario(slotProps.data)" />
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
        <label for="id">ID transferencia:</label>
        <input type="text" v-model="formId" readonly class="border rounded-md p-2">
        
      </div>
    <div style="max-height: 70vh;">
        <h2>Datos del Formulario</h2> 
        
        <!-- Select para Etapa -->
        <div class="field">
          <label for="etapa">Tipo de Formulario</label>
          <Dropdown v-model="form.etapa" :options="etapas" optionLabel="descrip_tipo_dictamen" optionValue="id" placeholder="Seleccionar..."></Dropdown>
        </div>

        <!-- Fechas -->
        <div class="field">
          <label>Duración (Inicio y Término de Etapa)</label>
          <Calendar v-model="fechaInicio" dateFormat="dd/mm/yy" placeholder="Fecha Inicio" :disabled="true"></Calendar>
          <Calendar v-model="fechaTermino" dateFormat="dd/mm/yy" placeholder="Fecha Término" :disabled="true"></Calendar>
        </div>

        <div class="field">
          <label>Fecha de registro del Formulario</label>
          <Calendar v-model="form.fechaRegistro" dateFormat="dd/mm/yy" placeholder="Fecha Registro" :disabled="true"></Calendar>
        </div>

        <h2>Justificación y Respaldo</h2>

        <!-- Preguntas con radio buttons -->
        <div >  
              <p>1. ¿Los recursos asignados corresponden a un gasto para transferencias de capital "transferencia público privada"?</p>
              <label>
                <input type="radio" :name="'pregunta_1'" value="1" v-model="form.pregunta_1">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta_1'" value="0" v-model="form.pregunta_1">
                No
              </label>
              
            </div>

        <!-- Repite el patrón para las demás preguntas -->
        <div >  
              <p>2. ¿La transferencia público privada es para el financiamiento de un proyecto de inversión en especie?</p>
              <label>
                <input type="radio" :name="'pregunta_2'" value="1" v-model="form.pregunta_2">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta_2'" value="0" v-model="form.pregunta_2">
                No
              </label>
              
            </div>
            <div >  
              <p>3. ¿La entidad o el área responsable, se encuentra autorizada para realizar transferencias público privadas?</p>
              <label>
                <input type="radio" :name="'pregunta_3'" value="1" v-model="form.pregunta_3">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta_3'" value="0" v-model="form.pregunta_3">
                No
              </label>
              <div>
                <label for="respaldo_pregunta_3">Documento:</label>
                <InputText id="respaldo_pregunta_3" v-model="form.respaldo_pregunta_3" required="true" />
                
                <label for="fecha_pregunta_3">Fecha:</label>
                <Calendar v-model="form.fecha_pregunta_3" dateFormat="dd/mm/yy" placeholder="Fecha Registro"></Calendar>

              </div>
            </div>
            <div >  
              <p>4. ¿Se cuenta con la Reglamentación para Transferencias público privadas aprobado por instancia competente?</p>
              <label>
                <input type="radio" :name="'pregunta_4'" value="1" v-model="form.pregunta_4">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta_4'" value="0" v-model="form.pregunta_4">
                No
              </label>
              <div>
                <label for="respaldo_pregunta_4">Documento:</label>
                <InputText id="respaldo_pregunta_4" v-model="form.respaldo_pregunta_4" required="true" />
                
                <label for="fecha_pregunta_3">Fecha:</label>
                <Calendar v-model="form.fecha_pregunta_4" dateFormat="dd/mm/yy" placeholder="Fecha Registro"></Calendar>
              </div>
            </div>  
            <div >  
              <p>5. ¿Se cuenta con el convenio vigente y está suscrito por autoridad competente?</p>
              <label>
                <input type="radio" :name="'pregunta_5'" value="1" v-model="form.pregunta_5">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta_5'" value="0" v-model="form.pregunta_5">
                No
              </label>
              <div>
                <label for="respaldo_pregunta_5">Documento:</label>
                <InputText id="respaldo_pregunta_5" v-model="form.respaldo_pregunta_5" required="true"/>
                
                <label for="fecha_pregunta_5">Fecha:</label>
                <Calendar v-model="form.fecha_pregunta_5" dateFormat="dd/mm/yy" placeholder="Fecha Registro"></Calendar>
              </div>
            </div> 
            <div >  
              <p>6. ¿Se cuenta con la Norma emitida por instancia competente que apruebe la transferencia público privada, estableciendo el importe, uso y destino de la misma?</p>
              <label>
                <input type="radio" :name="'pregunta_6'" value="1" v-model="form.pregunta_6">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta_6'" value="0" v-model="form.pregunta_6">
                No
              </label>
              <div>
                <label for="respaldo_pregunta_6">Documento:</label>
                <InputText id="respaldo_pregunta_6" v-model="form.respaldo_pregunta_6" required="true"/>
                
                <label for="fecha_pregunta_6">Fecha:</label>
                <Calendar v-model="form.fecha_pregunta_6" dateFormat="dd/mm/yy" placeholder="Fecha Registro"></Calendar>
              </div>
            </div> 

             <!-- Datos adicionales -->
             <div>
              <label for="mae">Nombre Máxima Autoridad Ejecutiva (MAE)</label>
              <InputText id="mae" v-model="form.mae" required="true"/>
            </div>
            <div>
              <label for="mae_cargo">Cargo MAE</label>
              <InputText id="mae_cargo" v-model="form.mae_cargo" required="true"/>
            </div>
            <div>
              <label for="mae_ci">C.I. MAE</label>
              <InputText id="mae_ci" v-model="form.mae_ci" required="true"/>
            </div>
            <div>
              <label for="mae_documento_designacion">Documento de Designación MAE</label>
              <InputText id="mae_documento_designacion" v-model="form.mae_documento_designacion" required="true"/>
            </div>

            <div>
              <label for="responsable">Nombre Responsable del Proyecto</label>
              <InputText id="responsable" v-model="form.responsable" required="true"/>
            </div>
            <div>
              <label for="responsable_cargo">Cargo Responsable</label>
              <InputText id="responsable_cargo" v-model="form.responsable_cargo" required="true"/>
            </div>
            <div>
              <label for="responsable_unidad">Unidad Responsable</label>
              <InputText id="responsable_unidad" v-model="form.responsable_unidad" required="true"/>
            </div>
            <div>
              <label for="responsable_ci">C.I. Responsable</label>
              <InputText id="responsable_ci" v-model="form.responsable_ci" required="true"/>
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
              <span>Modificar Formulario</span>
              <span>   </span>
              <span>   </span>
              <span>   </span>
              <span>   </span>
              <span>   </span>
              <span>   </span>

        <Button icon="pi pi-times" @click="cerrarModalEdit" class="p-button-text"></Button>
      </template>
      <div>
        <label for="dictamen_id">ID formulario:</label>
        <input type="text" v-model="form.dictamen_id" readonly class="border rounded-md p-2">
      </div>
      <div style="max-height: 70vh;">
        <h2>Datos del Formulario</h2>
        
        <!-- Select para Etapa -->
        <div class="field">
          <label for="etapa">Etapa del Formulario</label>
          <Dropdown v-model="etapaSeleccionada" :options="etapas" optionLabel="descrip_tipo_dictamen" placeholder="Seleccionar..."
                        class="w-full md:w-14rem" />
          <p>ID etapa seleccionada: {{ etapaSeleccionada.id }}</p>
        </div>

        <!-- Fechas -->
        <div class="field">
          <label>Duración (Inicio y Término de Etapa)</label>
          <Calendar v-model="fechaInicio" dateFormat="dd/mm/yy" placeholder="Fecha Inicio" :disabled="true"></Calendar>
          <Calendar v-model="fechaTermino" dateFormat="dd/mm/yy" placeholder="Fecha Término" :disabled="true"></Calendar>
        </div>

        <div class="field">
          <label>Fecha de registro del Formulario</label>
          <Calendar v-model="form.fecha_dictamen" dateFormat="dd/mm/yy" placeholder="Fecha Registro" :disabled="true"></Calendar>
        </div>

        <h2>Justificación y Respaldo</h2>

        <!-- Preguntas con radio buttons -->
        <div >  
              <p>1. ¿Los recursos asignados corresponden a un gasto para transferencias de capital "transferencia público privada"?</p>
              <label>
                <input type="radio" :name="'pregunta_1'" value="true" v-model="form.pregunta_1">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta_1'" value="false" v-model="form.pregunta_1">
                No
              </label>
              
            </div>

        <!-- Repite el patrón para las demás preguntas -->
        <div >  
              <p>2. ¿La transferencia público privada es para el financiamiento de un proyecto de inversión en especie?</p>
              <label>
                <input type="radio" :name="'pregunta_2'" value="true" v-model="form.pregunta_2">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta_2'" value="false" v-model="form.pregunta_2">
                No
              </label>
              
            </div>
            <div >  
              <p>3. ¿La entidad o el área responsable, se encuentra autorizada para realizar transferencias público privadas?</p>
              <label>
                <input type="radio" :name="'pregunta_3'" value="true" v-model="form.pregunta_3">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta_3'" value="false" v-model="form.pregunta_3">
                No
              </label>
              <div class="field">
                <label for="respaldo_pregunta_3">Documento:</label>
                <InputText id="respaldo_pregunta_3" v-model="form.respaldo_pregunta_3" required="true"/>
                
                <label>Fecha:</label>
                <Calendar v-model="form.fecha_pregunta_3" dateFormat="dd/mm/yy" placeholder="Fecha Registro"></Calendar>

              </div>
            </div>
            <div >  
              <p>4. ¿Se cuenta con la Reglamentación para Transferencias público privadas aprobado por instancia competente?</p>
              <label>
                <input type="radio" :name="'pregunta_4'" value="true" v-model="form.pregunta_4">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta_4'" value="false" v-model="form.pregunta_4">
                No
              </label>
              <div>
                <label for="respaldo_pregunta_4">Documento:</label>
                <InputText id="respaldo_pregunta_4" v-model="form.respaldo_pregunta_4" required="true"/>
                
                <label for="fecha_pregunta_3">Fecha:</label>
                <Calendar v-model="form.fecha_pregunta_4" dateFormat="dd/mm/yy" placeholder="Fecha Registro"></Calendar>
              </div>
            </div>  
            <div >  
              <p>5. ¿Se cuenta con el convenio vigente y está suscrito por autoridad competente?</p>
              <label>
                <input type="radio" :name="'pregunta_5'" value="true" v-model="form.pregunta_5">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta_5'" value="false" v-model="form.pregunta_5">
                No
              </label>
              <div>
                <label for="respaldo_pregunta_5">Documento:</label>
                <InputText id="respaldo_pregunta_5" v-model="form.respaldo_pregunta_5" required="true"/>
                
                <label for="fecha_pregunta_5">Fecha:</label>
                <Calendar v-model="form.fecha_pregunta_5" dateFormat="dd/mm/yy" placeholder="Fecha Registro"></Calendar>
              </div>
            </div> 
            <div >  
              <p>6. ¿Se cuenta con la Norma emitida por instancia competente que apruebe la transferencia público privada, estableciendo el importe, uso y destino de la misma?</p>
              <label>
                <input type="radio" :name="'pregunta_6'" value="true" v-model="form.pregunta_6">
                Sí
              </label>
              <label>
                <input type="radio" :name="'pregunta_6'" value="false" v-model="form.pregunta_6">
                No
              </label>
              <div>
                <label for="respaldo_pregunta_6">Documento:</label>
                <InputText id="respaldo_pregunta_6" v-model="form.respaldo_pregunta_6" required="true"/>
                
                <label for="fecha_pregunta_6">Fecha:</label>
                <Calendar v-model="form.fecha_pregunta_6" dateFormat="dd/mm/yy" placeholder="Fecha Registro"></Calendar>
              </div>
            </div> 

             <!-- Datos adicionales -->
             <div>
              <label for="mae">Nombre Máxima Autoridad Ejecutiva (MAE)</label>
              <InputText id="mae" v-model="form.mae" required="true"/>
            </div>
            <div>
              <label for="mae_cargo">Cargo MAE</label>
              <InputText id="mae_cargo" v-model="form.mae_cargo" required="true"/>
            </div>
            <div>
              <label for="mae_ci">C.I. MAE</label>
              <InputText id="mae_ci" v-model="form.mae_ci" required="true"/>
            </div>
            <div>
              <label for="mae_documento_designacion">Documento de Designación MAE</label>
              <InputText id="mae_documento_designacion" v-model="form.mae_documento_designacion" required="true"/>
            </div>

            <div>
              <label for="responsable">Nombre Responsable del Proyecto</label>
              <InputText id="responsable" v-model="form.responsable" required="true"/>
            </div>
            <div>
              <label for="responsable_cargo">Cargo Responsable</label>
              <InputText id="responsable_cargo" v-model="form.responsable_cargo" required="true"/>
            </div>
            <div>
              <label for="responsable_unidad">Unidad Responsable</label>
              <InputText id="responsable_unidad" v-model="form.responsable_unidad" required="true"/>
            </div>
            <div>
              <label for="responsable_ci">C.I. Responsable</label>
              <InputText id="responsable_ci" v-model="form.responsable_ci" required="true"/>
            </div>
      </div>  
    

      <template v-slot:footer>
        <Button label="Grabar" icon="pi pi-check" @click="guardarFormulario(form.dictamen_id)" class="p-button-primary"></Button>
        <Button label="Cerrar" icon="pi pi-times" @click="cerrarModalEdit" class="p-button-secondary"></Button>
      </template>
    </Dialog>

      <!-- Modal para editar formulario para modificar -->
      <Dialog :visible="mostrarModalModificacion" modal :style="{ width: '50vw' }" :draggable="false" :closable="false">
      <template v-slot:header>
              <span>Modificar Formulario yyyy</span>
              <span>   </span>
              <span>   </span>
              <span>   </span>
              <span>   </span>
              <span>   </span>
              <span>   </span>

        <Button icon="pi pi-times" @click="cerrarModalEdit" class="p-button-text"></Button>
      </template>
     
      <div style="max-height: 70vh;">
        <h2>Datos del Formulario</h2>
        
        <!-- Select para Etapa -->
        <div class="field">
          <label for="etapa">Etapa del Formulario</label>
          <Dropdown v-model="etapaSeleccionada" :options="etapas" optionLabel="descrip_tipo_dictamen" placeholder="Seleccionar..."
                        class="w-full md:w-14rem" />
          <p>ID etapa seleccionada: {{ etapaSeleccionada.id }}</p>
        </div>

        <!-- Fechas -->
        <div class="field">
          <label>Duración (Inicio y Término de Etapa)</label>
          <Calendar v-model="fechaInicio" dateFormat="dd/mm/yy" placeholder="Fecha Inicio" :disabled="true"></Calendar>
          <Calendar v-model="fechaTermino" dateFormat="dd/mm/yy" placeholder="Fecha Término" :disabled="true"></Calendar>
        </div>

        <div class="field">
          <label>Fecha de registro del Formulario</label>
          <Calendar v-model="form.fecha_dictamen" dateFormat="dd/mm/yy" placeholder="Fecha Registro" :disabled="true"></Calendar>
        </div>

        <h2>Justificación y Respaldo</h2>

        <!-- Preguntas con radio buttons -->
        
             <!-- Datos adicionales -->
             <div>
              <label for="mae">Nombre Máxima Autoridad Ejecutiva (MAE)</label>
              <InputText id="mae" v-model="form.mae" required="true"/>
            </div>
            <div>
              <label for="mae_cargo">Cargo MAE</label>
              <InputText id="mae_cargo" v-model="form.mae_cargo" required="true"/>
            </div>
            <div>
              <label for="mae_ci">C.I. MAE</label>
              <InputText id="mae_ci" v-model="form.mae_ci" required="true"/>
            </div>
            <div>
              <label for="mae_documento_designacion">Documento de Designación MAE</label>
              <InputText id="mae_documento_designacion" v-model="form.mae_documento_designacion" required="true"/>
            </div>

            <div>
              <label for="responsable">Nombre Responsable del Proyecto</label>
              <InputText id="responsable" v-model="form.responsable" required="true"/>
            </div>
            <div>
              <label for="responsable_cargo">Cargo Responsable</label>
              <InputText id="responsable_cargo" v-model="form.responsable_cargo" required="true"/>
            </div>
            <div>
              <label for="responsable_unidad">Unidad Responsable</label>
              <InputText id="responsable_unidad" v-model="form.responsable_unidad" required="true"/>
            </div>
            <div>
              <label for="responsable_ci">C.I. Responsable</label>
              <InputText id="responsable_ci" v-model="form.responsable_ci" required="true"/>
            </div>
      </div>  
    

      <template v-slot:footer>
        <Button label="Grabar" icon="pi pi-check" @click="guardarFormularioModificacion(form.dictamen_id)" class="p-button-primary"></Button>
        <Button label="Cerrar" icon="pi pi-times" @click="cerrarModalModificacion" class="p-button-secondary"></Button>
      </template>
    </Dialog>



  </div>
  <Dialog v-model:visible="deleteFormularioDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="dictamenes">Esta seguro de eliminar <b>{{ dictamenes.id }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteFormularioDialog = false" />
            <Button label="Si" icon="pi pi-check" @click="deleteFormulario(dictamenes.id )" />
        </template>
    </Dialog>

    <Dialog v-model:visible="cierreFormularioDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="dictamenes">El registro del formulario tiene carácter de declaración jurada, realizado el cierre los datos del Formulario NO podrán modificarse, tampoco se podrá eliminar el formulario cerrado.
              ¿Está seguro de cerrar el Formulario?<b>{{ dictamenes.transferencia_id }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="cierreFormularioDialog = false" />
            <Button label="Si" icon="pi pi-check" @click="confirmCierreFormulario(dictamenes.transferencia_id )" />
        </template>
    </Dialog>

</template>

<script setup>
import { ref, onMounted, Text, reactive } from 'vue';
import Fieldset from "primevue/fieldset";
import { useToast } from 'primevue/usetoast';
//import { useToast } from "primevue/usetoast";
//import { Dialog } from 'primevue/dialog';
//import { Dropdown } from 'primevue/dropdown';
//import { Calendar } from 'primevue/calendar';
//import { RadioButton } from 'primevue/radiobutton';
//import { Button } from 'primevue/button';
import axios from 'axios';
import transferenciaService from '../../../services/transferencia.service';
import dictamenService from '../../../services/dictamen.service';
import tipoDictamenService from '../../../services/tipoDictamen.service';
import { useRouter } from 'vue-router';
const toast = useToast();
// Variables reactivas
const proyectos = ref([]);
const transferencias = ref([]);
const dictamenes = ref([]);
const proyectosFiltrados = ref([]);
//const transferencia = ref([]);
//const transferenciasFiltrados = ref([]);
// Variables reactivas
//const proyectos = ref([]);
//const dictamenes = ref([]);
//const estadoSeleccionado = ref('en-registro');
const deleteFormularioDialog = ref(false);
const cierreFormularioDialog = ref(false);
const proyectoSeleccionado = ref(null);
const etapaSeleccionada = ref(null);
const mostrarModal = ref(false);  // Controla la visibilidad del modal
const mostrarModalVer = ref(false);  // Controla la visibilidad del modal
const mostrarModalEdit = ref(false);  // Controla la visibilidad del modal
const mostrarModalModificacion = ref(false);  // Controla la visibilidad del modal
// ID for the selected form
const formId = ref(null);
const fechaInicio = ref(null);
const fechaTermino = ref(null);
const id = null;

/*
const form = ref({
etapa: '',
fechaInicio: '',
fechaTermino: '',
fechaRegistro: '',
pregunta_1: '',
pregunta_2: '',
pregunta_3: '',
respaldo_pregunta_3: '', // Asegúrate de que tenga valor por defecto
fecha_pregunta_3:'',
pregunta_4: '',
respaldo_pregunta_4: '', 
fecha_pregunta_4:'',
pregunta_5: '',
respaldo_pregunta_5: '', 
fecha_pregunta_5:'',
pregunta_6: '',
respaldo_pregunta_6: '', 
fecha_pregunta_6:'',
mae: '',
mae_cargo: '',
mae_ci: '',
mae_documento_designacion: '',
responsable: '',
responsable_ci: '',
responsable_cargo: '',
responsable_unidad: ''
// otros campos
});
*/


const etapas = ref([]);


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

const defaultForm = {
  etapa: null,
  fechaInicio: null,
  fechaTermino: null,
  fechaRegistro: null,
  pregunta_1: null,
  pregunta_2: null,
  pregunta_3: null,
  respaldo_pregunta_3: '',
  fecha_pregunta_3: null,
  pregunta_4: null,
  respaldo_pregunta_4: '',
  fecha_pregunta_4: null,
  pregunta_5: null,
  respaldo_pregunta_5: '',
  fecha_pregunta_5: null,
  pregunta_6: null,
  respaldo_pregunta_6: '',
  fecha_pregunta_6: null,
  mae: '',
  mae_cargo: '',
  mae_ci: '',
  mae_documento_designacion: '',
  responsable: '',
  responsable_cargo: '',
  responsable_unidad: '',
  responsable_ci: ''
};

function validarFormulario() {
  // Array de errores
  let errores = [];

  // Validar campos obligatorios
  if (!form.etapa) errores.push('Etapa es requerida.');
  //if (!form.fechaInicio) errores.push('Fecha de inicio es requerida.');
  //if (!form.fechaTermino) errores.push('Fecha de término es requerida.');
  //if (!form.fechaRegistro) errores.push('Fecha de registro es requerida.');
  if (!form.pregunta_1) errores.push('La respuesta a la pregunta 1 es requerida.');
  if (!form.mae) errores.push('El nombre de la MAE es requerido.');
  if (!form.mae_cargo) errores.push('El cargo de la MAE es requerido.');
  if (!form.mae_ci) errores.push('El C.I. de la MAE es requerido.');
  if (!form.mae_documento_designacion) errores.push('El documento de designación de la MAE es requerido.');
  if (!form.responsable) errores.push('El nombre del responsable del proyecto es requerido.');
  if (!form.responsable_cargo) errores.push('El cargo del responsable del proyecto es requerido.');
  if (!form.responsable_unidad) errores.push('La unidad del responsable es requerida.');
  if (!form.responsable_ci) errores.push('El C.I. del responsable es requerido.');

  // Devolver los errores
  return errores;
}
// Clonar el estado inicial del formulario para usarlo
let form = reactive({ ...defaultForm  });

// Función para limpiar el formulario
function limpiarFormulario() {
  form = reactive({ ...defaultForm  });
}



const guardar = async () => {
  console.log('ID entro:', formId.value);
  //console.log('ID entro Form:', form.value.respaldo_pregunta_3);
  if (!formId.value) {
    console.error('No se ha seleccionado un ID');
    return;
  }

  const errores = validarFormulario();

  if (errores.length > 0) {
    // Mostrar errores usando PrimeVue Toast
    errores.forEach(error => {
      toast.add({ severity: 'error', summary: 'Error de validación', detail: error });
    });
    return; // No guardar si hay errores
  }

  // Prepare the form data
  const formData = reactive({
    id: formId.value, // Ensure the ID is sent
    etapa: form.etapa,
    fecha_registro: formatDate(form.fechaRegistro),
   
    fecha_inicio: formatDate(form.fechaInicio),
    fecha_termino: formatDate(form.fechaTermino),
    pregunta_1: form.pregunta_1,
    pregunta_2: form.pregunta_2,
    pregunta_3: form.pregunta_3,
    respaldo_pregunta_3: form.respaldo_pregunta_3,
    fecha_pregunta_3: formatDate(form.fecha_pregunta_3),
    pregunta_4: form.pregunta_4,
    respaldo_pregunta_4: form.respaldo_pregunta_4,
    fecha_pregunta_4: formatDate(form.fecha_pregunta_4),
    pregunta_5: form.pregunta_5,
    respaldo_pregunta_5: form.respaldo_pregunta_5,
    fecha_pregunta_5: formatDate(form.fecha_pregunta_5),
    pregunta_6: form.pregunta_6,
    respaldo_pregunta_6: form.respaldo_pregunta_6,
    fecha_pregunta_6: formatDate(form.fecha_pregunta_6),
    mae:form.mae,
    mae_cargo:form.mae_cargo,
    mae_ci: form.mae_ci,
    mae_documento_designacion: form.mae_documento_designacion,
    responsable: form.responsable,
    responsable_cargo: form.responsable_cargo,
    responsable_unidad: form.responsable_unidad,
    responsable_ci: form.responsable_ci
    // Add other form fields here
  });
  try {
    console.log("datos form",formData);
    const response = await dictamenService.guadarForm(formData.id,formData);
    //dictamenes.value = data;
    console.log('Formulario guardado con éxito:', response.data);
    console.log("Guardado correctamente. Iniciando carga de transferencias...");
    //await cargarProyectos(); //****
    await cargarProyectos();
    console.log("Transferencias cargadas correctamente");
    //refrescarRuta(); 
    refrescarPagina();
    cerrarModal();
  } catch (error) {
    //console.log(error.response.data);
    console.error('Error al guardar el formulario:', error);
  } finally {
    // Esto asegura que `cargarTransferencias` siempre se ejecutará
    await cargarProyectos();
    console.log("Transferencias cargadas o intento de cargar realizado");
  }
};

function formatDate(date) {

const d = new Date(date);
const year = d.getFullYear();
const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
const day = String(d.getDate()).padStart(2, '0');

return `${day}/${month}/${year}`;
}

function cerrar() {
mostrarModal.value = false;  // Oculta el modal estableciendo su valor a falso
form.value = {};  // Limpia el formulario, reinicia el objeto form
console.log("Formulario cerrado");
}

// Cargar proyectos al montar el componente
onMounted(async () => {
  await cargarProyectos();
  cargarTipoDictamen();
  transferencias.value.forEach(transferencia => {
    verificarTransferencia(transferencia.id);
  });
  //await getTransferencias();
});

// Función para cargar proyectos desde la API //listar transferencias
const cargarProyectos = async () => {
  try {
     // Obtener entidad_id desde el localStorage
     const entidadId = ref(localStorage.getItem('entidad_id'));
    const { data } = await transferenciaService.index(entidadId.value);
    transferencias.value = data;
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
    const { data } = await dictamenService.show(id);
    dictamenes.value = data;
    //dictamenes.value = response;
  } catch (error) {
    console.error('Error al cargar los dictámenes:', error);
  }
};

// Función para abrir el modal
const abrirModalVer = async (id, datos) => {
  try {
    fechaInicio.value = datos.fecha_inicio;  // fechas guardadas en transferencias
  fechaTermino.value = datos.fecha_termino;    // fechas guardadas en transferencias
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
const abrirModalEdit = async(id) => {
  try {
  
    const { data } = await dictamenService.mostrarForm(id);
    form.value = data;
    console.log("Edit",form.value);
    console.log("Edit",form.value[0].fecha_registro);
    console.log("Trans ID",form.value[0].transferencia_id);
    form.dictamen_id = form.value[0].dictamen_id,
    form.transferencia_id = form.value[0].transferencia_id,
    form.etapa = form.value[0].etapa_id,
    form.fechaRegistro = formatDate(form.value[0].fecha_registro),
    form.fecha_dictamen = formatDate(form.value[0].fecha_dictamen),
    form.fechaInicio = formatDate(form.value[0].etapa_fecha_inicio),
    form.fechaTermino = formatDate(form.value[0].etapa_fecha_fin),
    form.pregunta_1 =Boolean(form.value[0].pregunta_1),
    form.pregunta_2 = form.value[0].pregunta_2,
    form.pregunta_3 = form.value[0].pregunta_3,
    form.respaldo_pregunta_3 = form.value[0].respaldo_pregunta_3,
    form.fecha_pregunta_3 = formatDate(form.value[0].fecha_pregunta_3),
    console.log("fecha",form.fechaInicio);
    Object.assign(form, data[0]);
            // selectedArea.value = areas.value.find(area => area.id === transferencia.value[0].area_id);
    etapaSeleccionada.value = etapas.value.find(etapa => etapa.id === form.value[0].etapa_id);
    console.log("Formulario para edición:", form.value);
    mostrarModalEdit.value = true;
    // Rellenar otros campos...
  } catch (error) {
    console.error('Error al cargar los datos del formulario', error);
  }


};

// Función para cerrar el modal
const cerrarModalEdit = () => {
mostrarModalEdit.value = false;
};

// Función para guardar el nuevo dictamen
const guardarFormularioModificacion = async (dictamen_id) => {
  console.log("Formulario Re",form.fechaRegistro)
  console.log("Formulario IN",form.fechaInicio)
  console.log("Formulario ID",formId)
  const formData = reactive({
    //id: formId, // Ensure the ID is sent
    id:form.transferencia_id,
    dictamen_id: form.dictamen_id,
    etapa: etapaSeleccionada.value.id,
    fecha_registro: formatDate(form.fecha_dictamen),
   
    fecha_inicio: formatDate(form.fechaInicio),
    fecha_termino: formatDate(form.fechaTermino),
    pregunta_1: form.pregunta_1,
    pregunta_2: form.pregunta_2,
    pregunta_3: form.pregunta_3,
    respaldo_pregunta_3: form.respaldo_pregunta_3,
    fecha_pregunta_3: formatDate(form.fecha_pregunta_3),
    pregunta_4: form.pregunta_4,
    respaldo_pregunta_4: form.respaldo_pregunta_4,
    fecha_pregunta_4: formatDate(form.fecha_pregunta_4),
    pregunta_5: form.pregunta_5,
    respaldo_pregunta_5: form.respaldo_pregunta_5,
    fecha_pregunta_5: formatDate(form.fecha_pregunta_5),
    pregunta_6: form.pregunta_6,
    respaldo_pregunta_6: form.respaldo_pregunta_6,
    fecha_pregunta_6: formatDate(form.fecha_pregunta_6),
    mae: form.mae,
    mae_cargo: form.mae_cargo,
    mae_ci: form.mae_ci,
    mae_documento_designacion: form.mae_documento_designacion,
    responsable: form.responsable,
    responsable_cargo: form.responsable_cargo,
    responsable_unidad: form.responsable_unidad,
    responsable_ci: form.responsable_ci
    // Add other form fields here
  });

try {
  //await axios.post(`/api/dictamenes/${proyectoSeleccionado.value.codigo_tpp}`, nuevoDictamen.value);
  //await toggleDictamen(proyectoSeleccionado.value.codigo_tpp);  // Recargar los dictámenes
  console.log("datos form",formData);
    const response = await dictamenService.modificarForm(form.dictamen_id,formData);
    abrirModalVer(form.transferencia_id);
    //dictamenes.value = data;
    console.log('Formulario guardado con éxito:', response.data);



  cerrarModalEdit();  // Cerrar el modal después de guardar
} catch (error) {
  console.error('Error al agregar el dictamen:', error);
}
};

// Función para abrir el modal
const abrirModalModificacion = async(id) => {
  try {
  
    const { data } = await dictamenService.mostrarForm(id);
    form.value = data;
    console.log("Edit",form.value);
    console.log("Edit",form.value[0].fecha_registro);
    console.log("Trans ID",form.value[0].transferencia_id);
    form.dictamen_id = form.value[0].dictamen_id,
    form.transferencia_id = form.value[0].transferencia_id,
    form.etapa = form.value[0].etapa_id,
    form.fechaRegistro = formatDate(form.value[0].fecha_registro),
    form.fecha_dictamen = formatDate(form.value[0].fecha_dictamen),
    form.fechaInicio = formatDate(form.value[0].etapa_fecha_inicio),
    form.fechaTermino = formatDate(form.value[0].etapa_fecha_fin),
    form.pregunta_1 =Boolean(form.value[0].pregunta_1),
    form.pregunta_2 = form.value[0].pregunta_2,
    form.pregunta_3 = form.value[0].pregunta_3,
    form.respaldo_pregunta_3 = form.value[0].respaldo_pregunta_3,
    form.fecha_pregunta_3 = formatDate(form.value[0].fecha_pregunta_3),
    console.log("fecha",form.fechaInicio);
    Object.assign(form, data[0]);
            // selectedArea.value = areas.value.find(area => area.id === transferencia.value[0].area_id);
    etapaSeleccionada.value = etapas.value.find(etapa => etapa.id === form.value[0].etapa_id);
    console.log("Formulario para edición:", form.value);
    mostrarModalModificacion.value = true;
    // Rellenar otros campos...
  } catch (error) {
    console.error('Error al cargar los datos del formulario', error);
  }


};


// Función para cerrar el modal
const cerrarModalModificacion = () => {
mostrarModalModificacion.value = false;
};

// Función para abrir el modal
// Function to open the modal and receive the ID
const abrirModal = (id,datos) => {
  formId.value = id;
  console.log("datos", datos);
  console.log("datos", datos.fecha_termino);
    // Si las fechas vienen en formato de cadena (YYYY-MM-DD), convertirlas a objetos Date
  fechaInicio.value = datos.fecha_inicio;  // fechas guardadas en transferencias
  fechaTermino.value = datos.fecha_termino;    // fechas guardadas en transferencias
  // Store the ID
  console.log("ID",formId.value);
  limpiarFormulario(); // Limpiar el formulario antes de abrir el modal
  mostrarModal.value = true; // Open the modal
};

 const activarCierre = async(id) => {
  formId.value = id; // Store the ID
  console.log("ID",formId.value);
  try {


    const response = await transferenciaService.activarCierre(formId.value);
    //abrirModalVer(form.transferencia_id);
    //dictamenes.value = data;
    console.log('Cierre activado con éxito:', response.data);

} catch (error) {
  console.error('Error al Cierre activado:', error);
}
};

// Crear un objeto reactivo para almacenar el estado de cada transferencia
const transferenciaStatus = ref({});
// Función para verificar si ya existe una transferencia por ID y actualizar el estado
const verificarTransferencia = async (id) => {
  const resultado = await hasTransferencia(id);
  transferenciaStatus.value[id] = resultado;
};

// Variable reactiva para controlar el estado del botón "Agregar"
const hasTransferencia = async (id) => {
  try {
    const { data } = await dictamenService.show(id);
    dictamenes.value = data;
    
    if (dictamenes.value && dictamenes.value.length > 0) {
      const transferenciaId = dictamenes.value[0].transferencia_id;
      console.log("if",transferenciaId);
      // Comprobar si ya existe una transferencia con ese ID
      return transferenciaId//transferencias.value.some(transferencia => transferencia.id === transferenciaId);
    } else {
      console.log("else",dictamenes.value);
      return 0; // No hay registros válidos
    }
  } catch (error) {
    console.error("Error al verificar transferencia:", error);
    return false;
  }
};

// Función para cerrar el modal
const cerrarModal = () => {
mostrarModal.value = false;
};

// Función para guardar el nuevo dictamen
const guardarFormulario = async (dictamen_id) => {
  console.log("Formulario Re",form.fechaRegistro)
  console.log("Formulario IN",form.fechaInicio)
  console.log("Formulario ID",formId)
  const formData = reactive({
    //id: formId, // Ensure the ID is sent
    id:form.transferencia_id,
    dictamen_id: form.dictamen_id,
    etapa: etapaSeleccionada.value.id,
    fecha_registro: formatDate(form.fecha_dictamen),
   
    fecha_inicio: formatDate(form.fechaInicio),
    fecha_termino: formatDate(form.fechaTermino),
    pregunta_1: form.pregunta_1,
    pregunta_2: form.pregunta_2,
    pregunta_3: form.pregunta_3,
    respaldo_pregunta_3: form.respaldo_pregunta_3,
    fecha_pregunta_3: formatDate(form.fecha_pregunta_3),
    pregunta_4: form.pregunta_4,
    respaldo_pregunta_4: form.respaldo_pregunta_4,
    fecha_pregunta_4: formatDate(form.fecha_pregunta_4),
    pregunta_5: form.pregunta_5,
    respaldo_pregunta_5: form.respaldo_pregunta_5,
    fecha_pregunta_5: formatDate(form.fecha_pregunta_5),
    pregunta_6: form.pregunta_6,
    respaldo_pregunta_6: form.respaldo_pregunta_6,
    fecha_pregunta_6: formatDate(form.fecha_pregunta_6),
    mae: form.mae,
    mae_cargo: form.mae_cargo,
    mae_ci: form.mae_ci,
    mae_documento_designacion: form.mae_documento_designacion,
    responsable: form.responsable,
    responsable_cargo: form.responsable_cargo,
    responsable_unidad: form.responsable_unidad,
    responsable_ci: form.responsable_ci
    // Add other form fields here
  });

try {
  //await axios.post(`/api/dictamenes/${proyectoSeleccionado.value.codigo_tpp}`, nuevoDictamen.value);
  //await toggleDictamen(proyectoSeleccionado.value.codigo_tpp);  // Recargar los dictámenes
  console.log("datos form",formData);
    const response = await dictamenService.modificarForm(form.dictamen_id,formData);
    abrirModalVer(form.transferencia_id);
    //dictamenes.value = data;
    console.log('Formulario guardado con éxito:', response.data);



  cerrarModalEdit();  // Cerrar el modal después de guardar
} catch (error) {
  console.error('Error al agregar el dictamen:', error);
}
};

const refrescarPagina = () => {
  window.location.reload();
};
async function confirmCierreFormulario(prod) {
    // Verificar que el objeto prod tenga el id y transferencia_id necesarios
    console.log("cierre ID:",prod)
    if (prod ) {
        dictamenes.value = prod;
        console.log("ID transferencia",prod);
              try {
              const { data } = await transferenciaService.cierreFormulario(prod);
              //etapas.value = data;
              //refrescarRuta(); 
              refrescarPagina();
            } catch (error) {
              console.error("Error al cerrar:", error);
            }
    } else {
        console.error("Datos inválidos para cerrar formulario");
    }
}

function abrirModalCierre(prod) {
    // Verificar que el objeto prod tenga el id y transferencia_id necesarios
    if (prod && prod.id && prod.transferencia_id) {
        dictamenes.value = prod;
        console.log("ID transferencia cierre", dictamenes.value.transferencia_id);
        //toggleDictamen(dictamenes.value.transferencia_id);  // Cambiar si es necesario
        cierreFormularioDialog.value = true;  // Mostrar diálogo de confirmación
        //dictamenes.value = prod;
    } else {
        console.error("Datos inválidos para eliminar el dictamen");
    }
}

function confirmDeleteFormulario(prod) {
    // Verificar que el objeto prod tenga el id y transferencia_id necesarios
    if (prod && prod.id && prod.transferencia_id) {
        dictamenes.value = prod;
        console.log("ID transferencia", dictamenes.value.transferencia_id);
        //toggleDictamen(dictamenes.value.transferencia_id);  // Cambiar si es necesario
        deleteFormularioDialog.value = true;  // Mostrar diálogo de confirmación
        //dictamenes.value = prod;
    } else {
        console.error("Datos inválidos para eliminar el dictamen");
    }
}

const router = useRouter();

const refrescarRuta = () => {
  router.push({ path: router.currentRoute.value.path })  // Empuja la ruta actual para refrescarla
};

async function deleteFormulario() {
    try {
        // Verifica si hay un dictamen válido para eliminar
        if (dictamenes.value.id) {
            console.log("Eliminando dictamen con ID:", dictamenes.value.id);  // Añade este log para depurar
            
            // Almacenar temporalmente transferencia_id antes de limpiar dictamenes
            const transferenciaId = dictamenes.value.transferencia_id;
            
            const { data } = await dictamenService.destroy(dictamenes.value.id);
            
            // Acción completada con éxito
            deleteFormularioDialog.value = false;  // Cierra el diálogo de confirmación
            dictamenes.value = {};  // Limpia el dictamen seleccionado
            console.log("ID transferencia", transferenciaId);
            
            // Recargar la lista usando el transferencia_id guardado
            toggleDictamen(transferenciaId);  
            refrescarRuta(); 
            //Toast.add({ severity: 'success', summary: 'Successful', detail: 'Dictamen eliminado', life: 3000 });
        } else {
            console.error("No hay dictamen válido para eliminar. dictamenes.value:", dictamenes.value);
        }
    } catch (error) {
        console.error("Error al eliminar el dictamen", error);
        //Toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el dictamen', life: 3000 });
    }
}

async function cargarTipoDictamen() {
  try {
    const { data } = await tipoDictamenService.index();
    etapas.value = data;
  } catch (error) {
    console.error("Error al cargar los departamentos:", error);
  }
}

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
