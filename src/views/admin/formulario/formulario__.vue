<template>
  <div>
    <DataTable :value="projects" responsiveLayout="scroll" :expandedRows="expandedRows" @row-expand="onRowExpand" @row-collapse="onRowCollapse">
      <Column field="codigo" header="CÓDIGO TPP"></Column>
      <Column field="nombre" header="Nombre"></Column>
      <Column field="fechaInicio" header="Fecha Inicio"></Column>
      <Column field="fechaTermino" header="Fecha Término"></Column>
      <Column field="estado" header="Estado"></Column>
      <Column expander style="width: 3em"></Column> <!-- Columna para expandir -->

      <!-- Template para mostrar los formularios al expandir -->
      <template #rowgroup="slotProps">
        <div class="p-3">
          <h4>Formularios para el proyecto: {{ slotProps.data.nombre }}</h4>
          <DataTable :value="slotProps.data.children" responsiveLayout="scroll">
            <Column field="tipoDictamen" header="Tipo Dictamen"></Column>
            <Column field="fechaDictamen" header="Fecha Dictamen"></Column>
            <Column header="Acciones">
              <template #body="formSlotProps">
                <Button icon="pi pi-eye" class="p-button-rounded p-button-success" label="Ver Formulario" @click="verFormulario(formSlotProps.data)"/>
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning" label="Editar Formulario" @click="editarFormulario(formSlotProps.data)"/>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>
</template>
<script setup>
import { ref } from 'vue';
//import { DataTable } from 'primevue/datatable';
//import { Column } from 'primevue/column';
//import { Button } from 'primevue/button';

const projects = ref([
  {
    codigo: 'TPP-0047-000046',
    nombre: 'compra de semillas La Paz - Chulumani',
    fechaInicio: '2024-08-01',
    fechaTermino: '2024-08-29',
    estado: 'En registro',
    children: [
      { tipoDictamen: 'Dictamen 1', fechaDictamen: '2024-09-10' },
      { tipoDictamen: 'Dictamen 2', fechaDictamen: '2024-09-15' }
    ]
  },
  {
    codigo: 'TPP-0047-000047',
    nombre: 'CONST. SISTEMA DE MICRORIEGO TECNIFICADO COMUNIDAD SAMPAYA',
    fechaInicio: '2024-08-21',
    fechaTermino: '2024-08-29',
    estado: 'En registro',
    children: []
  },
  {
    codigo: 'TPP-0047-000048',
    nombre: 'transferencia ca localizacion ca',
    fechaInicio: '2024-08-27',
    fechaTermino: '2024-08-27',
    estado: 'En registro',
    children: [
      { tipoDictamen: 'Dictamen 58', fechaDictamen: '2024-09-10' }
    ]
  }
]);

const expandedRows = ref([]); // Filas que están expandibles

function verFormulario(node) {
  console.log("Ver Formulario", node);
}

function editarFormulario(node) {
  console.log("Editar Formulario", node);
}

function onRowExpand(event) {
  console.log("Row expanded", event.data);
}

function onRowCollapse(event) {
  console.log("Row collapsed", event.data);
}
</script>


