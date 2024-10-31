<script setup lang="ts">
import { ref } from 'vue'
//import InputText from 'primevue/inputtext'
//import Button from 'primevue/button'
//import Card from 'primevue/card'
import MapComponent from '../components/MapComponent.vue'
import transferenciaService from '../services/transferencia.service';

const latitude = ref('')
const longitude = ref('')

const updateCoordinates = (coords: { lat: number; lon: number }) => {
  latitude.value = coords.lat.toFixed(6)
  longitude.value = coords.lon.toFixed(6)
}

const handleSubmit = () => {
    console.log("punto",form);
  console.log('Coordinates submitted:', {
    latitude: latitude.value,
    longitude: longitude.value
  })

  const id = form;
 
  try {
                const { data } = await transferenciaService.guardarPunto(172);
                //etapas2.value = data;
              } catch (error) {
                console.error("Error al cargar los datos:", error);
              }

}
</script>

<template>
  <Card class="location-form">
    <template #title>
      Location Coordinates
    </template>
    <template #content>
      <MapComponent
        @update:coordinates="updateCoordinates"
        class="map-container"
      />
      
      <div class="form-group">
        <span class="p-float-label">
          <InputText
            id="latitude"
            v-model="latitude"
            type="text"
            readonly
          />
          <label for="latitude">Latitud</label>
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
          <label for="longitude">Longitud</label>
        </span>
      </div>
      
      <Button
        label="Guardar"
        @click="handleSubmit"
        :disabled="!latitude || !longitude"
        class="submit-button"
      />
    </template>
  </Card>
</template>

<style scoped>
.location-form {
  max-width: 800px;
  margin: 0 auto;
}

.map-container {
  margin-bottom: 1.5rem;
  border-radius: 4px;
  overflow: hidden;
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

.submit-button {
  width: 100%;
}
</style>