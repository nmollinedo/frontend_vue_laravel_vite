<template>
  <div class="card" >
    <ProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".5s"
            aria-label="Custom ProgressSpinner"
            v-if="loading"
            />
  <h2>Lista de Transferencias</h2>

  <!-- Filtro por estado de los proyectos usando PrimeVue Dropdown -->
  <div style="display: flex; align-items: center; gap: 10px;">
    <label for="estado">Estado:</label>
    
    <!-- Dropdown -->
    <Dropdown 
      id="estado" 
      :options="estados" 
      v-model="estadoSeleccionado" 
      optionLabel="descripcion" 
      @change="filtrarTransferencia" 
      placeholder="Seleccionar Estado" />
    
    <!-- Botón al lado derecho del Dropdown -->
    <button @click="actualizarTabla" style="margin-left: auto; border: 2px solid gold; color: black; background-color: white; padding: 10px 20px; border-radius: 5px;">
      Actualizar Tabla
    </button>
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
  <Column field="nombre_formal" header="Nombre" sortable class="fixed-column"></Column>
  <Column field="fecha_inicio" header="Fecha Inicio" sortable></Column>
  <Column field="fecha_termino" header="Fecha Término" sortable></Column>
 <!-- <Column field="clasificacion" header="Clasificación" sortable></Column>
  <Column field="bloqueo_proyecto" header="Clasificación" sortable></Column>  -->
  <Column field="entidad" header="Ent." sortable></Column>
  <Column field="estado" header="Estado" sortable></Column>

  <Column header="Acciones">
    <!-- Template para definir las acciones dentro de cada fila -->
    <template #body="slotProps">
      <!-- Mostrar el valor de la función hasTransferencia 
      <div>
        <p>Has transferencia: {{ transferenciaStatus[slotProps.data.id] }}</p>
      </div>-->
      
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
        label="Agregar modificación" 
        icon="pi pi-plus" 
        @click="abrirModalModificacion(slotProps.data.dictamen_id)" 
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

      <Dialog v-model:visible="mostrarModalVer" modal :style="{ width: '80vw' }" :draggable="false">
        <template v-slot:header>
              <span>Ver formulario</span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
        </template>
        <div class="dictamenes-etapa">
              <h3>Lista de formularios: </h3>

              <!-- DataTable de PrimeVue para mostrar los dictámenes -->
              <DataTable :value="dictamenes"  class="p-mt-4">
                
                <Column header="Ver" body="verTemplate"></Column>
              <!--  <Column field="transferencia_id" body="Id"></Column>
                <Column field="dictamen_id" body="Id"></Column>  -->
                <Column field="tipo_dictamen" header="Tipo de formulario"></Column>
              <!--  <Column field="etapa" header="Etapa"></Column> -->
                <Column field="fecha_dictamen" header="Fecha formulario"></Column>
                <Column field="proyecto_fecha_inicio" header="Fecha Inicio"></Column>
                <Column field="proyecto_fecha_fin" header="Fecha Termino"></Column>
                <Column field="usuario_cierre" header="Usuario Cierre"></Column>
                <Column header="Imprimir" body="imprimirTemplate">
                  <template #body="slotProps">
                  <Button 
                      label="Imprimir" 
                      icon="pi pi-print" 
                      @click="abrirModalEdit(slotProps.data.dictamen_id)" 
                      class="p-button-text" />
                    </template>   
                </Column>
                <Column header="Acciones">
                  <template #body="slotProps">
                    <Button 
                    v-if="slotProps.data.cierre_entidad !== 1 && slotProps.data.tipo_dictamen_id === 1"
                      label="Editar" 
                      icon="pi pi-pencil" 
                      @click="abrirModalEdit(slotProps.data.dictamen_id)" 
                      class="p-button-text" />
                      <Button 
                    v-if="slotProps.data.cierre_entidad!==1 && slotProps.data.tipo_dictamen_id === 4"
                      label="Editar Fecha" 
                      icon="pi pi-pencil" 
                      @click="abrirModalEditFecha(slotProps.data.dictamen_id)" 
                      class="p-button-text" />

                   <!--   <Button 
                    v-if="slotProps.data.cierre_entidad!==1"
                      label="Cierre" 
                      icon="pi pi-pencil" 
                      @click="abrirModalCierre(slotProps.data)" 
                      class="p-button-text" />-->

                      <Button 
                            v-if="slotProps.data.bloqueo_proyecto===0" 
                            label="Cierre Form."
                            icon="pi pi-lock-open" 
                            @click="abrirModalCierre(slotProps.data)"
                            class="p-button-text" />
                      
                            
                            <Button 
                            v-if="slotProps.data.cierre_entidad!==1 && slotProps.data.tipo_dictamen_id!==3"
                            label="Cierre Form-"
                            icon="pi pi-lock-open" 
                            @click="abrirModalCierre(slotProps.data)"
                            class="p-button-text" />   
                            <Button 
                            v-if="slotProps.data.cierre_entidad!==1 && slotProps.data.tipo_dictamen_id===3"
                            label="Cierre FormC"
                            icon="pi pi-lock-open" 
                            @click="abrirModalCierre(slotProps.data)"
                            class="p-button-text" />     
                      <Button 
                            v-if="slotProps.data.cierre_entidad!==1"
                            icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteFormulario(slotProps.data)" />

                  <!--    <Button 
                            v-if="slotProps.data.cierre_entidad===1"
                            label="Eliminar Cierre"
                            icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteCierre(slotProps.data)" /> -->
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
       <!-- Displaying the received ID 
       <div>
        <label for="id">ID transferencia:</label>
        <input type="text" v-model="formId" readonly class="border rounded-md p-2">
        
      </div>-->
    <div style="max-height: 70vh;">
        <h2>Datos del Formulario</h2> {{form.dictamen_id}}
        
        <!-- Select para Etapa -->
        <div class="field">
          <label for="etapa">Tipo de Formulario</label>
          <Dropdown v-model="form.etapa" :options="etapas" optionLabel="descrip_tipo_dictamen" optionValue="id" placeholder="Seleccionar..."></Dropdown>
        </div>

        <!-- Fechas -->
        <div class="field">
          <label>Duración (Inicio y Término)</label>
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
                <Calendar v-model="form.fecha_pregunta_3" dateFormat="dd-mm-yy" placeholder="Fecha Registro"></Calendar>

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
<!--      <div>
        <label for="dictamen_id">ID formulario:</label>
        <input type="text" v-model="form.dictamen_id" readonly class="border rounded-md p-2">
        <label for="dictamen_id">ID trans:</label>
        <input type="text" v-model="form.transferencia_id" readonly class="border rounded-md p-2">
      </div>  -->
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
          <label>Duración (Inicio y Término)</label>
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

  <!-- Modal para editar formulario para modificar fecha -->
      <Dialog :visible="mostrarModalModificacion" modal :style="{ width: '50vw' }" :draggable="false" :closable="false">
      <template v-slot:header>
              <span>Modificar Formulario Fechas--</span>
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
          <Dropdown v-model="etapaSeleccionada" :options="etapas2" optionLabel="descrip_tipo_dictamen" placeholder="Seleccionar..."
                        class="w-full md:w-14rem" />
          <p>ID etapa seleccionada: {{ etapaSeleccionada.id }}</p>
        </div>
        

        <!-- Fechas -->
        <div class="field">
          <label>Duración (Inicio y Término)</label>
          <Calendar v-model="form.fechaInicio" dateFormat="dd-mm-yy" placeholder="Fecha Inicio"></Calendar>
          <Calendar v-model="form.fechaTermino" dateFormat="dd-mm-yy" placeholder="Fecha Término" ></Calendar>
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

    <!-- Modal para editar formulario para editar modificar fecha -->
      <Dialog :visible="mostrarModalModificacionEdit" modal :style="{ width: '50vw' }" :draggable="false" :closable="false">
      <template v-slot:header>
              <span>Modificar Formulario Fechas yyyy</span>
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
          <Dropdown v-model="etapaSeleccionada" :options="etapas2" optionLabel="descrip_tipo_dictamen" placeholder="Seleccionar..."
                        class="w-full md:w-14rem" />
          <p>ID etapa seleccionada: {{ etapaSeleccionada.id }}</p>{{form}}
        </div>
        

        <!-- Fechas -->
        <div class="field">
          <label>Duración (Inicio y Término)</label>
          <Calendar v-model="form.fechaInicio" dateFormat="dd-mm-yy" placeholder="Fecha Inicio"></Calendar>
          <Calendar v-model="form.fechaTermino" dateFormat="dd-mm-yy" placeholder="Fecha Término" ></Calendar>
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

    <!-- Modal para editar fecha -->
      <Dialog :visible="mostrarModalEditFecha" modal :style="{ width: '50vw' }" :draggable="false" :closable="false">
      <template v-slot:header>
              <span>Modificar Formulario Fechas ffff</span>
              <span>   </span>
              <span>   </span>
              <span>   </span>
              <span>   </span>
              <span>   </span>
              <span>   </span>

        <Button icon="pi pi-times" @click="cerrarModalEditFecha" class="p-button-text"></Button>
      </template>
     
      <div style="max-height: 70vh;">
        <h2>Datos del Formulario</h2>
        
        <!-- Select para Etapa -->
        <div class="field">
          <label for="etapa">Etapa del Formulario</label>
    <!--      <Dropdown v-model="etapaSeleccionada" :options="etapas2" optionLabel="descrip_tipo_dictamen" placeholder="Seleccionar..."
                        class="w-full md:w-14rem" /> -->
          <p>ID etapa seleccionada: {{ form.tipo_dictamen_id }}</p>{{form}}
        </div>
        

        <!-- Fechas -->
        <div class="field">
          <label>Duración (Inicio y Término)</label>
          <Calendar v-model="form.fechaInicio" dateFormat="dd-mm-yy" placeholder="Fecha Inicio"></Calendar>
          <Calendar v-model="form.fechaTermino" dateFormat="dd-mm-yy" placeholder="Fecha Término" ></Calendar>
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
        <Button label="Grabar" icon="pi pi-check" @click="guardarFormularioEditFecha(form.dictamen_id)" class="p-button-primary"></Button>
        <Button label="Cerrar" icon="pi pi-times" @click="cerrarModalEditFecha" class="p-button-secondary"></Button>
      </template>
    </Dialog>


    <!-- Modal para editar formulario para modificar fecha -->
      <Dialog :visible="mostrarModalModificacion" modal :style="{ width: '70vw' }" :draggable="false" :closable="false">
      <template v-slot:header>
              <span>Modificar Formulario- </span>
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
          <label for="etapa">Etapa del Formulario. {{ esModificableForm }}</label>
          <!-- <Message severity="error" v-if="etapas2" :content="'Para actualizar los valores, presiona la tecla Enter (↵) mientras estés editando cualquier campo. Esto recalculará automáticamente los totales.'" placeholder="Seleccionar..." /> -->
          <div v-if="!esModificableForm.valueOf()" class="modal-content-error">
              <h2>Atención</h2>
              <p>Para actualizar los valores del formulario, tiene que cerrar los formularios abiertos.</p>
          </div>
          <Dropdown v-model="etapaSeleccionada" :options="etapas2" optionLabel="descrip_tipo_dictamen" placeholder="Seleccionar..."
                        class="w-full md:w-14rem"  :disabled="!esModificableForm.valueOf()"  />
          <p>ID etapa seleccionada: {{ etapaSeleccionada.id }}</p>
        </div>
        
        <div v-if="etapaSeleccionada && etapaSeleccionada.id === 4">
        <!-- Fechas -->
        <div class="field">
          <label>Duración (Inicio y Término)</label>{{form.transferencia_id}}
          <Calendar v-model="form.fechaInicio" dateFormat="dd-mm-yy" placeholder="Fecha Inicio"></Calendar>
          <Calendar v-model="form.fechaTermino" dateFormat="dd-mm-yy" placeholder="Fecha Término" ></Calendar>
        </div>

        <div class="field">
          <label>Fecha de registro del Formulario</label>
          <Calendar v-model="form.fecha_dictamen" dateFormat="dd-mm-yy" placeholder="Fecha Registro" :disabled="true"></Calendar>
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

        <div v-if="etapaSeleccionada && etapaSeleccionada.id === 3">
              <!-- Fechas -->
              <div class="field">
                <label>Duración (Inicio y Término)</label>
                <Calendar v-model="form.fechaInicio" dateFormat="dd-mm-yy" placeholder="Fecha Inicio" :disabled="true"></Calendar>
                <Calendar v-model="form.fechaTermino" dateFormat="dd-mm-yy" placeholder="Fecha Término" :disabled="true"></Calendar>
              </div>

              <div class="field">
                <label>Fecha de registro del Formulario</label>
                <Calendar v-model="form.fecha_dictamen" dateFormat="dd/mm/yy" placeholder="Fecha Registro" :disabled="true"></Calendar>
              </div>

              <div class="field">
                <label>Modificar Costo</label>{{form.transferencia_id}}
                <!-- Botón para abrir el diálogo 
                <Button label="Ver Componentes de Costos" icon="pi pi-info" @click="abrirDialogo(form.dictamen_id)" />-->
                
              </div>
              <div>
                <template v-if="!mostrarFormulario">
                        <Button 
                            label="Agregar componente" 
                            icon="pi pi-check" 
                            @click="mostrarComponente"
                            style="background-color: #1e88e5; border-color: #1e88e5; color: #fff;" 
                            />
                    </template>
                    <template v-else>
                        <Button 
                            label="Ocultar agregar" 
                            icon="pi pi-times" 
                            @click="noMostrarComponente"
                            style="background-color: #1e88e5; border-color: #1e88e5; color: #fff;" 
                            />
                    </template>
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
                        <!-- Mostrar la lista de componentes (opcional para debugging) -->
                       

                        <!-- Columna Componentes Etapa -->
                        <Column field="componente" header="Componentes Etapa" :style="{ width: '150px' }"/>

                        <!-- Columnas editables con InputNumber -->
                        <Column field="monto_aporte_local" header="Aporte Propio (Bs.)" editor="true" :style="{ width: '150px' }" bodyStyle="text-align: right">
                            <template #editor="slotProps">
                                <InputNumber 
                                    v-model="slotProps.data.monto_aporte_local" 
                                    mode="decimal" 
                                    :min="0" 
                                    :step="0.01" 
                                    :maxFractionDigits="2" 
                                    :useGrouping="true"  
                                    :locale="'es-ES'"
                                    :currency="false"
                                />
                            </template>
                        </Column>

                        <Column field="monto_cofinanciamiento" header="Co-Finan./Transf. (Bs.)" editor="true" :style="{ width: '150px' }" bodyStyle="text-align: right">
                            <template #editor="slotProps">
                            <InputNumber v-model="slotProps.data.monto_cofinanciamiento" mode="decimal" :min="0" :step="0.01" :maxFractionDigits="2" />
                            </template>
                        </Column>

                        <Column field="monto_finan_externo" header="Finan. Externo (Bs.)" editor="true" :style="{ width: '150px' }" bodyStyle="text-align: right">
                            <template #editor="slotProps">
                            <InputNumber v-model="slotProps.data.monto_finan_externo" mode="decimal" :min="0" :step="0.01" :maxFractionDigits="2" />
                            </template>
                        </Column>

                        <Column field="monto_otros" header="Otros (Bs.)" editor="true" :style="{ width: '150px' }" bodyStyle="text-align: right">
                            <template #editor="slotProps">
                            <InputNumber v-model="slotProps.data.monto_otros" mode="decimal" :min="0" :step="0.01" :maxFractionDigits="2" />
                            </template>
                        </Column>

                        <!-- Columna para mostrar el total de cada fila -->
                        <Column header="Total (Bs.)" :style="{ width: '150px' }" bodyStyle="text-align: right">
                            <template #body="slotProps">
                                {{ getRowTotal(slotProps.data) }}
                            </template>
                        </Column>

                        <!-- Columna para el RowEditor (botón de edición/guardar) 
                        <Column rowEditor headerStyle="width: 7rem" bodyStyle="text-align:center"></Column>-->
                        
                        <!-- Columna de acciones para eliminar -->
                        <Column header="Actions" :style="{ width: '100px' }">
                            <template #body="slotProps">
                                <Button
                                icon="pi pi-pencil"
                                class="p-button-rounded p-button-text"
                                @click="openEditDialog(slotProps.data)"
                            />    
                                <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="deleteComponent(slotProps.data)" />
                            </template>
                        </Column>

                        <!-- Footer para mostrar los totales de las columnas -->
                        <!-- Fila para agregar un nuevo componente -->
                            <template #footer>
                                <template v-if="mostrarFormulario">
                                <tr>
                                    
                                    <td >
                                        <Dropdown 
                                        v-model="componenteSelecionado" 
                                        :options="componentes" 
                                        optionLabel="componente"
                                        placeholder="Seleccione componente" 
                                        class="custom-dropdown" 
                                        :disabled="editDialogVisible"
                                    />
                                    </td>               
                                    <td><InputNumber v-model="selectedComponent.monto_aporte_local" inputId="integeronly" fluid @input="updateTotal"/></td>
                                    <td><InputNumber v-model="selectedComponent.monto_cofinanciamiento" inputId="integeronly" fluid @input="updateTotal" /></td>
                                    <td><InputNumber v-model="selectedComponent.monto_finan_externo" inputId="integeronly" fluid @input="updateTotal" /></td>
                                    <td><InputNumber v-model="selectedComponent.monto_otros" inputId="integeronly" fluid @input="updateTotal" /></td>
                                    <td class="total-cell">{{ totalSuma }}</td>
                                    <td>
                                        <template v-if="editDialogVisible">
                                            <Button icon="pi pi-check"  class="p-button-rounded p-button-text" @click="saveEdit" />
                                            <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="cancelarForm()" 
                                            />
                                        </template>
                                        <template v-else>
                                            <Button icon="pi pi-plus" class="p-button-rounded p-button-text" @click="guardarComponente" />
                                            <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="cancelarForm()" />
                                        </template>
                                    </td>

                                </tr>
                                </template>
                                <tr>
                                <td :style="{ width: '250px', textAlign: 'right' }">Total:</td>
                                <td :style="{ width: '250px', textAlign: 'right' }">{{ formatCurrency(getColumnTotal('monto_aporte_local')) }}</td>
                                <td :style="{ width: '250px', textAlign: 'right' }">{{ formatCurrency(getColumnTotal('monto_cofinanciamiento')) }}</td>
                                <td :style="{ width: '250px', textAlign: 'right' }">{{ formatCurrency(getColumnTotal('monto_finan_externo')) }}</td>
                                <td :style="{ width: '250px', textAlign: 'right' }">{{ formatCurrency(getColumnTotal('monto_otros')) }}</td>
                                <td :style="{ width: '250px', textAlign: 'right' }">{{ formatCurrency(getGrandTotal()) }}</td>
                                <td class="total-cell"></td>
                                </tr>
                            </template>
                        </DataTable>
                  </div> 
              </div>

        
        </div>  

      </div>

      <template v-slot:footer>
        <Button label="Grabar" icon="pi pi-check" @click="guardarFormularioModificacion(form.dictamen_id)" class="p-button-primary" :disabled="!esModificableForm.valueOf()"></Button>
        <Button label="Cerrar" icon="pi pi-times" @click="cerrarModalModificacion" class="p-button-secondary"></Button>
      </template>
    </Dialog>

    <div>
    

    <!-- Dialog para mostrar los componentes de costos -->
    <Dialog header="Componentes de Costos" v-model:visible="mostrarComponenteDialog" :style="{ width: '50vw' }" modal>
      <!-- Botón para abrir el diálogo
    <Button label="Ver Componentes de Costos" icon="pi pi-info" @click="mostrarDialog = true" /> -->
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
      
      <!-- Botón para cerrar el diálogo -->
      <template #footer>
        <Button label="Cerrar" icon="pi pi-times" @click="mostrarModal = false" />
      </template>
    </Dialog>
  </div>


  </div>
  <Dialog v-model:visible="deleteFormularioDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="dictamenes">Esta seguro de eliminar <b>{{ dictamenEliminar.id }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteFormularioDialog = false" />
            <Button label="Si" icon="pi pi-check" @click="deleteFormulario(dictamenEliminar.id )" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteCierreDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="dictamenes">Esta seguro de eliminar cierre<b>{{ dictamenEliminar.dictamen_id }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteCierreDialog = false" />
            <Button label="Si" icon="pi pi-check" @click="deleteCierre(dictamenEliminar.dictamen_id,dictamenEliminar.transferencia_id )" />
        </template>
    </Dialog>

    <Dialog v-model:visible="cierreFormularioDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="dictamenes">El registro del formulario tiene carácter de declaración jurada, realizado el cierre los datos del Formulario NO podrán modificarse, tampoco se podrá eliminar el formulario cerrado.
              ¿Está seguro de cerrar el Formulario??</span><!--<b>{{ dictamenEditar.transferencia_id }}</b>-->
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="cierreFormularioDialog = false" />
            <Button label="Si" icon="pi pi-check" @click="confirmCierreFormulario(dictamenEditar.transferencia_id, dictamenEditar)" />
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

import { eventBus } from "../../../utils/eventBus";
import componenteService from '../../../services/componente.service';


// Cambiar la entidad cuando el usuario selecciona una nueva
function cambiarEntidad(nuevaEntidad) {
  store.commit('setEntidadId', nuevaEntidad.id);
}


const toast = useToast();
// Variables reactivas
const proyectos = ref([]);
const transferencias = ref([]);
const dictamenes = ref([]);
const dictamenEliminar = ref(null);
const dictamenEditar = ref(null);
const proyectosFiltrados = ref([]);
//const transferencia = ref([]);
//const transferenciasFiltrados = ref([]);
// Variables reactivas
//const proyectos = ref([]);
//const dictamenes = ref([]);
//const estadoSeleccionado = ref('en-registro');
const deleteFormularioDialog = ref(false);
const deleteCierreDialog = ref(false);
const cierreFormularioDialog = ref(false);
const proyectoSeleccionado = ref(null);
const etapaSeleccionada = ref(null);
const etapaSeleccionada2 = ref(null);
const mostrarModal = ref(false);  // Controla la visibilidad del modal
const mostrarModalVer = ref(false);  // Controla la visibilidad del modal
const mostrarModalEdit = ref(false);  // Controla la visibilidad del modal
const mostrarModalEditFecha = ref(false);  // Controla la visibilidad del modal
const mostrarModalModificacion = ref(false);  // Controla la visibilidad del modal
const mostrarModalModificacionEdit = ref(false);  // Controla la visibilidad del modal
// ID for the selected form
const formId = ref(null);
const fechaInicio = ref(null);
const fechaTermino = ref(null);
const id = null;
const loading = ref(true);

const componentes = ref([]);
const listaComponentes = ref([]);
const selectedComponente = ref([]);

const editDialogVisible = ref(false);
const selectedComponent = ref({});
const componenteSelecionado = ref({ id: null });
const totalSuma = ref(0);

const etapas = ref([]);
const etapas2 = ref([]);

const mostrarFormulario = ref(false);
const estados = ref([
{ id: 1, descripcion: 'En registro' },
{ id: 2, descripcion: 'Validado Entidad' }
]);

const estadoSeleccionado = ref(null);

const errorMessage = ref('');
const esModificableForm = ref(false);
/*
const filtrarProyectos = () => {
// Lógica para filtrar los proyectos según el estado seleccionado
console.log('Filtrar proyectos por estado:', estadoSeleccionado.value);
};*/

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

// Funciones para formatear los números con miles y dos decimales
const formatNumber = (num) => {
  return num.toLocaleString( { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Cargar proyectos al montar el componente
onMounted(async () => {
  await cargarProyectos();
  cargarTipoDictamen();
  cargarTipoDictamen2();
  transferencias.value.forEach(transferencia => {
    verificarTransferencia(transferencia.id);
  });
  listarComponentes();
  cargarComponente();

   //await getTransferencias();
});
// Estado del diálogo
const mostrarComponenteDialog = ref(false);
// Función para abrir el diálogo
const abrirDialogo = (dictamen_id) => {
  mostrarComponenteDialog.value = true;
};

// Función para cerrar el diálogo
const cerrarDialogo = () => {
  mostrarComponenteDialog.value = false;
};

// Lista de componentes de costos (puedes obtenerla de una API o definirla localmente)
const componentesCostos = ref([
  { componente: 'Componente 1', descripcion: 'Descripción del componente 1', monto: 15000.25 },
  { componente: 'Componente 2', descripcion: 'Descripción del componente 2', monto: 3200.75 },
  { componente: 'Componente 3', descripcion: 'Descripción del componente 3', monto: 5000.50 },
]);

// Función para formatear los montos
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(value);
};

//Componentes metodos
//Listar componentes formulario
const listarComponentes = async () => {
       //console.log("componente",transferencia.value[0].id)
       console.log("componente", form.transferencia_id)
//       transferencia_id=componentes.value.transferencia_id;
//       componente_id=componentes.value.componente_id;
const transferencia=form.transferencia_id;
    try {
    
    const { data } = await dictamenService.listarFormCosto(transferencia);
    //const { data } = await componenteService.show(form.transferencia_id);
      console.log("data",data);
    
    listaComponentes.value = data;
    //transferencias.value.codigo_presupuestario=codigoPresupuestario;

           
    } catch (error) {
        //alert("error al recuperar la lista de componentes")
    }
};
/*
//Listar componentes formulario
const listarComponentes = async () => {
       //console.log("componente",transferencia.value[0].id)
       console.log("componente", form.transferencia_id)
//       transferencia_id=componentes.value.transferencia_id;
//       componente_id=componentes.value.componente_id;
    try {
    
    //const { data } = await componenteService.show(transferencia.value[0].id);
    const { data } = await componenteService.show(form.transferencia_id);
      console.log("data",data);
    
    listaComponentes.value = data;
    //transferencias.value.codigo_presupuestario=codigoPresupuestario;

           
    } catch (error) {
        //alert("error al recuperar la lista de componentes")
    }
};
*/
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

// Funccion guarda componente
const guardarComponente = async () => {
    const selectedComponenteId = componenteSelecionado.value.id;
    console.log("Componente ID",selectedComponenteId)
    console.log("Transferencia ID",form.transferencia_id)
    console.log("dictamen ID",form.dictamen_id)
    console.log(" monto_aporte_local",componentes.value.monto_aporte_local)
    console.log(" monto_aporte_local",componentes.value.monto_cofinanciamiento)
    try {
        // Crear el payload con los datos de la transferencia
        const payload = {
            dictamen_id:form.dictamen_id,
            transferencia_id: form.transferencia_id,
            componente_id: componenteSelecionado.value.id,
            monto_aporte_local: selectedComponent.value.monto_aporte_local,
            monto_cofinanciamiento: selectedComponent.value.monto_cofinanciamiento,
            monto_finan_externo:selectedComponent.value.monto_finan_externo,
            monto_otros:selectedComponent.value.monto_otros,

        };
        console.log(payload);
        // Llamar al servicio para guardar la problemática
        const { data } = await dictamenService.guardarDictamenCosto(payload);
        listarComponentes();
        // Mostrar mensaje de éxito o manejar la respuesta según sea necesario
        console.log(data);
        toast.add({ severity: 'success', summary: 'Guardar', detail: 'Se guardo correctamente', life: 3000 });
         // Limpiar el formulario después de guardar
         cargarComponente();
         limpiarFormularioComponente();
         noMostrarComponente();
    } catch (err) {
        error.value = 'Error saving data';
    }
};

// Función para abrir el diálogo con los datos seleccionados
const openEditDialog = (rowData) => {
  selectedComponent.value = { ...rowData }; // Copia los datos del componente
  console.log("componentes",componentes)
  mostrarFormulario.value = true;
  componenteSelecionado.value = componentes.value.find(ent => ent.id === selectedComponent.value.componente_id);
//   componentes.value = { ...rowData }; // Copia los datos del componente
  updateTotal();
  editDialogVisible.value = true; // Mostrar el diálogo
};

const cancelarForm = () => {
    editDialogVisible.value = false; // Mostrar el diálogo
    componenteSelecionado.value = {};
    selectedComponent.value = {}; // Copia los datos del componente
    totalSuma.value = 0;
};

// Función para guardar los cambios
const saveEdit = async() => {
    try {
    // Crear el payload con los datos del componente seleccionado
    const payload = {
      transferencia_id: selectedComponent.value.transferencia_id,  // o el campo que corresponda
      componente_id: selectedComponent.value.componente_id,       // ID del componente
      monto_aporte_local: selectedComponent.value.monto_aporte_local,
      monto_cofinanciamiento: selectedComponent.value.monto_cofinanciamiento,
      monto_finan_externo: selectedComponent.value.monto_finan_externo,
      monto_otros: selectedComponent.value.monto_otros,
    };

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
    editDialogVisible.value = false;
    limpiarFormularioComponente();
    noMostrarComponente();
  } catch (error) {
    // Manejar el error, si ocurre
    console.error('Error al guardar los cambios:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el componente', life: 3000 });
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

  return total.toFixed(2); // Devuelve el total con 2 decima
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
    const total = listaComponentes.value.reduce((total, item) => {
    return total + parseFloat(getRowTotal(item)) || 0;
  }, 0);

  return parseFloat(total.toFixed(2)); // Devuelve el total con 2 decimales como número
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

async function cargarComponente() {
  try {
    const { data } = await componenteService.index();
    componentes.value = data;
  } catch (error) {
    console.error("Error al cargar los departamentos:", error);
  }
};

const editComponent = (rowData) => {
  console.log('Edit:', rowData);
  // Add logic for editing the row data
};

const deleteComponent = async(rowData) => {
  console.log('Delete:', rowData.transferencia_id);
  console.log('Delete:', rowData.componente_id);
  const transferencia_id = rowData.transferencia_id;
  const componente_id = rowData.componente_id;
  try {
    
    const { data } = await dictamenService.eliminarDictamenCosto(transferencia_id,componente_id);
    listarComponentes();
    cargarComponente();
    } catch (error) {
        alert("error al eliminar componentes")
    }
  // Add logic for deleting the row data
};

//----------------------------
const loadTransferencias = async (entidadId) => {
  try {
    console.log("load trans adentro",entidadId.value)
   // const var.value = entidadId.value;
    const { data } = await transferenciaService.listarTrafrenciaFormulario(entidadId.value);
    for (let i = 0; i < data.length; i++) {
        data[i].fecha_inicio = formatDateVista(data[i].fecha_inicio);
        data[i].fecha_termino = formatDateVista(data[i].fecha_termino);
    }
    transferencias.value = data;
  } catch (error) {
    console.error('Error al cargar las transferencias', error);
  }
};

// Escucha el evento 'entidadSeleccionada'
eventBus.on('entidadSeleccionada', (entidadId) => {
  loadTransferencias(entidadId);
});

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

// Función que se llama al hacer clic en el botón de actualizar
function actualizarTabla() {
    cargarProyectos();
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
  console.log("form id transfer cia",formId.value);
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
    cargarProyectosVerificandoTabla();
    // refrescarPagina();
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

//verificar estado formulario
const verificarFormularioActivo = async (id) => {
    try {
        // Supongo que 'data' es un array
        console.log("lista formulario activo", transferencias);
        const { data } = await dictamenService.verificarFormulario(id);
        
        // Asegúrate de que 'data' tiene al menos un elemento
        if (data && data.length > 0 ) {
            
            esModificableForm.value = false;
            console.log("lista formulario activo", 0);
            return false;
        } else {
            console.error("No se encontró información válida en la respuesta");
            esModificableForm.value = true;
            return true; // O algún valor por defecto si no hay datos válidos
        }
    } catch (error) {
        console.error("Error al verificar el formulario activo", error);
        esModificableForm.value = false;
        return false; // Manejo de errores
    }
}

// Función para cargar transferencias desde la API //listar transferencias
const cargarProyectos = async () => {
  try {
    loading.value = true;
     // Obtener entidad_id desde el localStorage
     
     const entidadId = ref(localStorage.getItem('entidad_id'));
    const { data } = await transferenciaService.listarTrafrenciaFormulario(entidadId.value);
    console.log("lista formulario",data);
     for (let i = 0; i < data.length; i++) {
        data[i].fecha_inicio = formatDateVista(data[i].fecha_inicio);
        data[i].fecha_termino = formatDateVista(data[i].fecha_termino);
    }
    transferencias.value = data;
    //proyectos.value = response.data;
    
    filtrarTransferencia();
    
    ///const bandera = verificarFormularioActivo();
    //console.log("Bandera", bandera);
    loading.value = false;
  } catch (error) {
    console.error('Error al cargar los proyectos:', error);
  }
};

function formatDateVista(date) {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
}

const cargarProyectosVerificandoTabla = async () => {
  await cargarProyectos();
  transferencias.value.forEach(transferencia => {
    verificarTransferencia(transferencia.id);
  });
};

// Filtrar proyectos por estado
const filtrarTransferencia = async() => {
  //const entidad_id.value= ref(localStorage.getItem('entidad_id'));
  const entidadId = ref(localStorage.getItem('entidad_id'));

 /*
  const payload = {
                  estado_id: estadoSeleccionado.value.id
                  };
*/
  const estado_id = estadoSeleccionado.value.id
  console.log("Estado proyecto",estado_id);
  console.log("Estado proyecto ID",entidadId.value);
  const { data } = await transferenciaService.filtrarTransferencia(entidadId.value,estado_id);
  transferencias.value = data;

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
    console.log("abrir modal",id); 
    console.log("abrir modal datos",datos);
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
  console.log("formulario ID dictamen",id);
  try {
  
    const { data } = await dictamenService.mostrarForm(id);
    form.value = data;
    console.log("Editar form data",data);
    console.log("Edit",form.value[0].fecha_registro);
    console.log("Trans ID",form.value[0].transferencia_id);
    form.dictamen_id = form.value[0].dictamen_id,
    form.transferencia_id = form.value[0].transferencia_id,
    form.etapa = form.value[0].etapa_id,
    form.fechaRegistro = formatDateVista(form.value[0].fecha_registro),
    form.fecha_dictamen = formatDateVista(form.value[0].fecha_dictamen),
    form.fechaInicio = formatDateVista(form.value[0].etapa_fecha_inicio),
    form.fechaTermino = formatDateVista(form.value[0].etapa_fecha_fin),
    form.pregunta_1 =Boolean(form.value[0].pregunta_1),
    form.pregunta_2 = form.value[0].pregunta_2,
    form.pregunta_3 = form.value[0].pregunta_3,
    form.respaldo_pregunta_3 = form.value[0].respaldo_pregunta_3,
    form.fecha_pregunta_3 = formatDateVista(form.value[0].fecha_pregunta_3),
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

const abrirModalEditFecha = async(id) => {
  console.log("formulario ID dictamen",id);
  try {
  
    const { data } = await dictamenService.mostrarFormEditFecha(id);
    form.value = data;
    console.log("Editar form data",data);
    console.log("Edit",form.value[0].fecha_registro);
    console.log("Trans ID",form.value[0].transferencia_id);
    form.dictamen_id = form.value[0].dictamen_id,
    form.transferencia_id = form.value[0].transferencia_id,
    form.etapa = form.value[0].tipo_dictamen_id,
    form.fechaRegistro = formatDateVista(form.value[0].fecha_registro),
    form.fecha_dictamen = formatDateVista(form.value[0].fecha_dictamen),
    form.fechaInicio = formatDateVista(form.value[0].proyecto_fecha_inicio),
    form.fechaTermino = formatDateVista(form.value[0].proyecto_fecha_fin),
    form.pregunta_1 =Boolean(form.value[0].pregunta_1),
    form.pregunta_2 = form.value[0].pregunta_2,
    form.pregunta_3 = form.value[0].pregunta_3,
    form.respaldo_pregunta_3 = form.value[0].respaldo_pregunta_3,
    form.fecha_pregunta_3 = formatDateVista(form.value[0].fecha_pregunta_3),
    console.log("fecha",form.fechaInicio);
    Object.assign(form, data[0]);
            // selectedArea.value = areas.value.find(area => area.id === transferencia.value[0].area_id);
    //etapaSeleccionada.value = etapas.value.find(etapa => etapa.id === form.value[0].tipo_dictamen_id);
    console.log("Formulario para edición:", form.value);
    mostrarModalEditFecha.value = true;
    // Rellenar otros campos...
  } catch (error) {
    console.error('Error al cargar los datos del formulario', error);
  }
};

// Función para cerrar el modal
const cerrarModalEdit = () => {
mostrarModalEdit.value = false;
};

// Función para cerrar el modal
const cerrarModalEditFecha = () => {
mostrarModalEditFecha.value = false;
};

// Función para guardar el nuevo dictamen
const guardarFormularioModificacion = async (dictamen_id) => {
  console.log("Formulario Re",form.fechaRegistro)
  console.log("Formulario IN",form.fechaInicio)
  console.log("Formulario Termino",form.fechaTermino)
  console.log("Formulario ID",formId)
  console.log("Select ID",etapaSeleccionada.value.id)

  const bandera = verificarFormularioActivo(form.transferencia_id); 

  /*    if (bandera!=0){
        toast.add({ severity: 'info', summary: 'Información', detail: 'Debe cerrar el formulario que aun tiene registrado', life: 3000 });
        
      }else{*/

  
            const formData = reactive({
              //id: formId, // Ensure the ID is sent
              transferencia_id:form.transferencia_id,
              dictamen_id: form.dictamen_id,
              etapa: etapaSeleccionada.value.id,
              fecha_registro: form.fecha_dictamen,
            
              fecha_inicio:form.fechaInicio,
              fecha_termino: form.fechaTermino,
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
                const response = await dictamenService.modificarFecha(form.dictamen_id,formData);
                console.log("transferencia ID",form.transferencia_id)
                //abrirModalVer(form.transferencia_id);
                //dictamenes.value = data;
                console.log('Formulario fecha modificada con éxito:', response.data);

                //mostrarModalModificacion=false;
                toast.add({ severity: 'success', summary: 'Guardar', detail: 'Se guardo correctamente', life: 3000 });
                //toast.add({ severity: 'error', summary: 'Formulario fecha modificada con éxito', detail: error });
              cerrarModalModificacion();  // Cerrar el modal después de guardar
              loadTransferencias();
              actualizarTabla();
            } catch (error) {
              console.error('Error al agregar el dictamen:', error);
            }
    //}
};


// Función para guardar el nuevo dictamen
const guardarFormularioEditFecha = async (dictamen_id) => {
  console.log("Formulario Re",form.fechaRegistro)
  console.log("Formulario IN",form.fechaInicio)
  console.log("Formulario Termino",form.fechaTermino)
  console.log("Formulario ID",formId)
  console.log("Select ID",form.tipo_dictamen_id)

  const bandera = verificarFormularioActivo(form.transferencia_id); 

  /*    if (bandera!=0){
        toast.add({ severity: 'info', summary: 'Información', detail: 'Debe cerrar el formulario que aun tiene registrado', life: 3000 });
        
      }else{*/

  
            const formData = reactive({
              //id: formId, // Ensure the ID is sent
              transferencia_id:form.transferencia_id,
              dictamen_id: form.dictamen_id,
              etapa: form.tipo_dictamen_id,
              fecha_registro: form.fecha_dictamen,
            
              fecha_inicio:form.fechaInicio,
              fecha_termino: form.fechaTermino,
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
                const response = await dictamenService.modificarEditFecha(form.dictamen_id,formData);
                console.log("transferencia ID",form.transferencia_id)
                //abrirModalVer(form.transferencia_id);
                //dictamenes.value = data;
                console.log('Formulario fecha Edit modificada con éxito:', response.data);

                //mostrarModalModificacion=false;
                toast.add({ severity: 'success', summary: 'Guardar', detail: 'Se guardo correctamente', life: 3000 });
                //toast.add({ severity: 'error', summary: 'Formulario fecha modificada con éxito', detail: error });
              cerrarModalEditFecha();  // Cerrar el modal después de guardar
              loadTransferencias();
              actualizarTabla();
            } catch (error) {
              console.error('Error al agregar el dictamen:', error);
            }
    //}
};


// Función para abrir el modal
const abrirModalModificacion = async(dictamen_id) => {
  try {
     console.log("modifica Fecha",form.dictamen_id);
    const { data } = await dictamenService.mostrarForm(dictamen_id);
    console.log("modifica fecha data",data);
    form.value = data;
    console.log("Edit form",form.value);
    console.log("Edit fecha registro",formatDateVista(form.value[0].fecha_registro));
    console.log("Edit fecha inicio",form.value[0].proyecto_fecha_inicio);
    console.log("Edit fecha fin",form.value[0].proyecto_fecha_fin);
    console.log("Trans ID",form.value[0].transferencia_id);
    form.dictamen_id = form.value[0].dictamen_id,
    form.transferencia_id = form.value[0].transferencia_id,
    form.etapa = form.value[0].etapa_id,
    form.fechaRegistro = formatDate(form.value[0].fecha_registro),
    form.fecha_dictamen = formatDate(form.value[0].fecha_dictamen),
    form.fechaInicio = form.value[0].proyecto_fecha_inicio,
    form.fechaTermino = form.value[0].proyecto_fecha_fin,
    form.pregunta_1 =Boolean(form.value[0].pregunta_1),
    form.pregunta_2 = form.value[0].pregunta_2,
    form.pregunta_3 = form.value[0].pregunta_3,
    form.respaldo_pregunta_3 = form.value[0].respaldo_pregunta_3,
    form.fecha_pregunta_3 = formatDate(form.value[0].fecha_pregunta_3),
    console.log("fecha iii",form.fechaInicio);
    console.log("fecha ttt",form.fechaTermino);
    console.log("Dictamen id",form.dictamen_id);
    Object.assign(form, data[0]);

    await verificarFormularioActivo(form.value[0].transferencia_id)

            // selectedArea.value = areas.value.find(area => area.id === transferencia.value[0].area_id);
    etapaSeleccionada.value = etapas.value.find(etapa => etapa.id === form.value[0].etapa_id);
    console.log("Formulario para edición:", form.value);
    mostrarModalModificacion.value = true;
    listarComponentes()
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
  console.log("Formulario Inicio",form.fechaInicio)
  console.log("Formulario Termino",form.fechaTermino)
  console.log("Formulario ID",formId)
  const formData = reactive({
    //id: formId, // Ensure the ID is sent
    transferencia_id:form.transferencia_id,
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
async function confirmCierreFormulario(prod,prod2) {
    // Verificar que el objeto prod tenga el id y transferencia_id necesarios
    console.log("cierre ID:",prod)
    console.log("cierre ID:",prod2.tipo_dictamen_id)
    if(prod2.tipo_dictamen_id===3){
      try {
              //cierre de dialogs
              cierreFormularioDialog.value = false;  
              mostrarModalVer.value = false;
              const payload = {
            dictamen_id:form.dictamen_id,
            transferencia_id: form.transferencia_id,
             };
             console.log("cerrando")
              const { data } = await transferenciaService.cierreFormulario(prod);
              const { data2 } = await dictamenService.carrarFormularioCosto(payload);
              //etapas.value = data;
              //refrescarRuta(); 
              //Cerrar forms y cargar datos
              
              cargarProyectosVerificandoTabla();
            } catch (error) {
              console.error("Error al cerrar:", error);
            }

    }else if (prod ) {
        dictamenes.value = prod;
        console.log("ID transferencia",prod);
              try {
              //cierre de dialogs
              cierreFormularioDialog.value = false;  
              mostrarModalVer.value = false;
              const { data } = await transferenciaService.cierreFormulario(prod);
              //etapas.value = data;
              //refrescarRuta(); 
              //Cerrar forms y cargar datos
              
              cargarProyectosVerificandoTabla();
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
        dictamenEditar.value = prod;
        console.log("ID transferencia cierre", dictamenEditar.value.transferencia_id);
        //toggleDictamen(dictamenes.value.transferencia_id);  // Cambiar si es necesario
        cierreFormularioDialog.value = true;  // Mostrar diálogo de confirmación
        //dictamenes.value = prod;
    } else {
        console.error("Datos inválidos para eliminar el dictamen");
    }
}

function confirmDeleteCierre(prod) {
    // Verificar que el objeto prod tenga el id y transferencia_id necesarios
    if (prod && prod.id && prod.transferencia_id) {
        dictamenEliminar.value = prod;
        deleteCierreDialog.value = true;  // Mostrar diálogo de confirmación

        console.log("ID transferencia", dictamenEliminar.value.transferencia_id);
        //toggleDictamen(dictamenes.value.transferencia_id);  // Cambiar si es necesario
        //dictamenes.value = prod;
    } else {
        console.error("Datos inválidos para eliminar el dictamen");
    }
}


function confirmDeleteFormulario(prod) {
    // Verificar que el objeto prod tenga el id y transferencia_id necesarios
    if (prod && prod.id && prod.transferencia_id) {
        dictamenEliminar.value = prod;
        console.log("ID transferencia", dictamenEliminar.value.transferencia_id);
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
        if (dictamenEliminar.value.dictamen_id) {
            console.log("Eliminando dictamen con ID:", dictamenEliminar.value.dictamen_id);  // Añade este log para depurar
            
            // Almacenar temporalmente transferencia_id antes de limpiar dictamenes
            const transferenciaId = dictamenEliminar.value.transferencia_id;
            
            const { data } = await dictamenService.destroy(dictamenEliminar.value.dictamen_id);
            
            // Acción completada con éxito
            deleteFormularioDialog.value = false;  // Cierra el diálogo de confirmación
            dictamenEliminar.value = {};  // Limpia el dictamen seleccionado
            mostrarModalVer.value = false;
            console.log("ID transferencia", transferenciaId);
            
            // Recargar la lista usando el transferencia_id guardado
            toggleDictamen(transferenciaId);  
            // refrescarRuta(); 
            cargarProyectosVerificandoTabla();
            //Toast.add({ severity: 'success', summary: 'Successful', detail: 'Dictamen eliminado', life: 3000 });
        } else {
            console.error("No hay dictamen válido para eliminar. dictamenes.value:", dictamenes.value);
        }
    } catch (error) {
        console.error("Error al eliminar el dictamen", error);
        //Toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el dictamen', life: 3000 });
    }
}

async function deleteCierre() {
  const Data = reactive({
    //id: formId, // Ensure the ID is sent
    transferencia_id:dictamenEliminar.value.transferencia_id
    // Add other form fields here
  });


    try {
        // Verifica si hay un dictamen válido para eliminar
        if (dictamenEliminar.value.dictamen_id) {
            console.log("Eliminando formulario con ID:", dictamenEliminar.value.dictamen_id);  // Añade este log para depurar
            
            // Almacenar temporalmente transferencia_id antes de limpiar dictamenes
            const transferenciaId = dictamenEliminar.value.transferencia_id;
            
            const { data } = await dictamenService.eliminarCierre(dictamenEliminar.value.dictamen_id,Data);
            
            // Acción completada con éxito
            cargarProyectosVerificandoTabla();
            deleteCierreDialog.value = false;
            mostrarModalVer.value = false;// Cierra el diálogo de confirmación
            //cerrarModalVer();
            //dictamenes.value = {};  // Limpia el dictamen seleccionado
            console.log("ID transferencia", transferenciaId);
            await cargarProyectos();
            // Recargar la lista usando el transferencia_id guardado
            //toggleDictamen(transferenciaId);  
            //deleteCierreDialog.value = false;
            //refrescarRuta(); 
            //Toast.add({ severity: 'success', summary: 'Successful', detail: 'Dictamen eliminado', life: 3000 });
        } else {
            console.error("No hay formulario válido para eliminar. formulario.value:", dictamenEliminar.value);
        }
    } catch (error) {
        console.error("Error al eliminar el formulario", error);
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
};
async function cargarTipoDictamen2() {
  /*
  const bandera = verificarFormularioActivo(form.transferencia_id); 
  console.log("bandera yyyy",form);
      if (bandera!=0){
        
        errorMessage.value = "Todos los campos son obligatorios.";
        
        //toast.add({ severity: 'info', summary: 'Información', detail: 'Debe cerrar el formulario que aun tiene registrado', life: 3000 });
        
      }else{
              try {
                const { data } = await tipoDictamenService.listar2();
                etapas2.value = data;
              } catch (error) {
                console.error("Error al cargar los departamentos:", error);
              }
      }  */
      try {
                const { data } = await tipoDictamenService.listar2();
                etapas2.value = data;
              } catch (error) {
                console.error("Error al cargar los departamentos:", error);
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
.fixed-column {
  width: 15rem; /* o usa 200px por ejemplo */
  max-width: 15rem;
  min-width: 15rem;
  overflow: hidden; /* Para evitar que el contenido desborde */
}

.dictamen-container {
  width: 100%;
  margin: 0 auto;
}

.tabla-proyectos, .dictamenes-etapa table {
  width: 100%;
  border-collapse: collapse;
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

.modal-content-error {
  padding: 7px;
  border-radius: 8px;
  margin: 7px auto;
  width: 100%;
  max-width: 500px; /* Limita el ancho máximo del modal */
  background-color: #ffeded; /* Fondo rojo claro para error */
  color: #d9534f; /* Texto en rojo */
  border: 1px solid #d9534f; /* Borde rojo */
  text-align: left;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra para destacar el modal */
  position: flex;
}



.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
}
</style>
