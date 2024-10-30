<template>
  <div>
    <Button label="Adicionar Recursos para Gastos TPP" icon="pi pi-plus" class="p-mb-3" @click="agregarFila" />

    <div class="p-field">
      <label for="gestion">Gestión:</label>
      <Dropdown v-model="selectedGestion" :options="gestiones" optionLabel="label" optionValue="value" placeholder="Selecciona gestión" />
    </div>

    <DataTable :value="gastos" responsiveLayout="scroll">
      <!-- Columnas de la tabla -->
      <Column field="saldo" header="Saldo">
        <template #body="slotProps">
          <Dropdown v-model="slotProps.data.saldo" :options="saldos" optionLabel="label" optionValue="value" />
        </template>
      </Column>

      <Column field="fuente" header="Fuente">
        <template #body="slotProps">
          <Dropdown v-model="slotProps.data.fuente" :options="fuentes" optionLabel="label" optionValue="value" />
        </template>
      </Column>

      <Column field="organismo" header="Organismo">
        <template #body="slotProps">
          <Dropdown v-model="slotProps.data.organismo" :options="organismos" optionLabel="label" optionValue="value" />
        </template>
      </Column>

      <Column field="orgTransferencia" header="Org. Transferencia">
        <template #body="slotProps">
          <InputText v-model="slotProps.data.orgTransferencia" />
        </template>
      </Column>

      <Column field="entTransferencia" header="Ent. Transferencia">
        <template #body="slotProps">
          <InputText v-model="slotProps.data.entTransferencia" />
        </template>
      </Column>

      <Column field="convenio" header="Convenio">
        <template #body="slotProps">
          <Dropdown v-model="slotProps.data.convenio" :options="convenios" optionLabel="label" optionValue="value" />
        </template>
      </Column>

      <Column field="montoProgramado" header="Monto Programado">
        <template #body="slotProps">
          <InputText v-model="slotProps.data.montoProgramado" />
        </template>
      </Column>

      <Column field="montoReprogramado" header="Monto Reprogramado">
        <template #body="slotProps">
          <InputText v-model="slotProps.data.montoReprogramado" />
        </template>
      </Column>

      <Column field="saldoDistReprog" header="Saldo Dist. Reprog.">
        <template #body="slotProps">
          <InputText v-model="slotProps.data.saldoDistReprog" />
        </template>
      </Column>

      <!-- Columna de acciones -->
      <Column header="Acciones">
        <template #body="slotProps">
          <!-- Botón Guardar -->
          <Button icon="pi pi-save" label="Guardar" class="p-button-rounded p-button-success p-mr-2" @click="guardarFila(slotProps.data)" />

          <!-- Botón Eliminar -->
          <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="eliminarFila(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
  <Card class="location-form">
    <template #title>
      Location Coordinates
    </template>
    <template #content>
      <div id="map" style="height: 400px; margin-bottom: 1rem;"></div>
      
      <div class="form-group">
        <span class="p-float-label">
          <InputText
            id="latitude"
            v-model="latitude"
            type="text"
            readonly
          />
          <label for="latitude">Latitude</label>
        </span>
      </div>
      
      <div class="form-group">
        <span class="p-float-label">
          <InputText
            id="longitude"
            v-model="longitude"
            type="text"
            readonly
          />
          <label for="longitude">Longitude</label>
        </span>
      </div>
      
      <Button
        label="Submit"
        @click="handleSubmit"
        :disabled="!latitude || !longitude"
      />
    </template>
  </Card>
</template>

<script setup>
//import { ref } from 'vue';

const selectedGestion = ref(null);
const gestiones = [
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' }
];

const saldos = [
  { label: 'SI', value: 'SI' },
  { label: 'NO', value: 'NO' }
];

const fuentes = [
  { label: '41', value: '41' },
  { label: '42', value: '42' }
];

const organismos = [
  { label: '119', value: '119' },
  { label: '111', value: '111' }
];

const convenios = [
  { label: '00000', value: '00000' },
  { label: '00001', value: '00001' }
];

const gastos = ref([]);

// Agrega una nueva fila vacía para edición
const agregarFila = () => {
  gastos.value.push({
    saldo: null,
    fuente: null,
    organismo: null,
    orgTransferencia: '',
    entTransferencia: '',
    convenio: null,
    montoProgramado: 0,
    montoReprogramado: 0,
    saldoDistReprog: 0
  });
};

// Eliminar una fila
const eliminarFila = (gasto) => {
  const index = gastos.value.indexOf(gasto);
  if (index !== -1) {
    gastos.value.splice(index, 1);
  }
};

// Guardar la fila (aquí puedes hacer un POST a tu API o algún otro procesamiento)
const guardarFila = (gasto) => {
  // Lógica para guardar la fila (podría ser enviar a una API)
  console.log("Guardando fila:", gasto);

  // Aquí podrías hacer una solicitud HTTP para guardar la fila en la base de datos
  // Ejemplo: await apiService.guardarGasto(gasto);

  // Muestra un mensaje de éxito (esto es solo un ejemplo)
  alert("Fila guardada exitosamente");
};
import { ref, onMounted } from 'vue';
//import InputText from 'primevue/inputtext';
//import Button from 'primevue/button';
//import Card from 'primevue/card';
//import * as L from 'leaflet';
//import L from 'leaflet';
//import 'leaflet/dist/leaflet.css';

const latitude = ref('');
const longitude = ref('');
let map;
let marker = null;

onMounted(() => {
  // Initialize map
  map = L.map('map').setView([0, 0], 2);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add click event to map
  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    latitude.value = lat.toFixed(6);
    longitude.value = lng.toFixed(6);
    
    // Update or create marker
    if (marker) {
      marker.setLatLng(e.latlng);
    } else {
      marker = L.marker(e.latlng).addTo(map);
    }
  });
});

const handleSubmit = () => {
  console.log('Coordinates submitted:', { latitude: latitude.value, longitude: longitude.value });
};



</script>

<style scoped>
.location-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.p-float-label {
  display: block;
}

:deep(.p-inputtext) {
  width: 100%;
}

:deep(.p-card) {
  margin: 1rem;
}
</style>