<script setup lang="ts">
import { ref, defineProps, guardReactiveProps } from 'vue'
//import InputText from 'primevue/inputtext'
//import Button from 'primevue/button'
//import Card from 'primevue/card'
import MapComponent from '../../../components/MapComponent.vue'
import transferenciaService from '../../../services/transferencia.service';

const latitude = ref('')
const longitude = ref('')

const props = defineProps<{
  idTransferencia: number | null // Asume que idTransferencia es opcional y puede ser null
}>()

const emit = defineEmits<{
  (e: 'data-saved'): void; // Define el evento que vas a emitir
}>();

const updateCoordinates = (coords: { lat: number; lon: number }) => {
  latitude.value = coords.lat
  longitude.value = coords.lon
}

const handleSubmit = async () => {
  try {
    const guardado = await transferenciaService.guardarCoordenadas(
      props.idTransferencia, { latitud: latitude.value, longitud: longitude.value })
    console.log(guardado)
    console.log('Coordinates submitted:', {
      latitud: latitude.value,
      longitud: longitude.value,
      idTransferencia: props.idTransferencia
    })
    // Emitir evento después de guardar
    emit('data-saved');
  } catch (error) {
    console.error('Error al cargar ubicaciones:', error)
  }
}
</script>

<template>
  <Card class="location-form">
    <template #title>
      Localizacion de las coordenadas
    </template>
    <template #content>
      <MapComponent :idTransferencia="props.idTransferencia" @update:coordinates="updateCoordinates"
        class="map-container" />

      <div class="form-group">
        <span class="p-float-label">
          <InputText id="latitude" v-model="latitude" type="text" readonly />
          <label for="latitude">Latitude</label>
        </span>
      </div>

      <div class="form-group">
        <span class="p-float-label">
          <InputText id="longitude" v-model="longitude" type="text" readonly />
          <label for="longitude">Longitude</label>
        </span>
      </div>

      <Button label="Guardar Localización" @click="handleSubmit" :disabled="!latitude || !longitude"
        class="submit-button" />
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