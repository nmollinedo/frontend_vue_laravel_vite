<script setup lang="ts">
import { ref, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Card from 'primevue/card'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const latitude = ref('')
const longitude = ref('')
let map: L.Map
let marker: L.Marker | null = null

onMounted(() => {
  // Initialize map
  map = L.map('map').setView([0, 0], 2)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // Add click event to map
  map.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng
    latitude.value = lat.toFixed(6)
    longitude.value = lng.toFixed(6)
    
    // Update or create marker
    if (marker) {
      marker.setLatLng(e.latlng)
    } else {
      marker = L.marker(e.latlng).addTo(map)
    }
  })
})

const handleSubmit = () => {
  console.log('Coordinates submitted:', { latitude: latitude.value, longitude: longitude.value })
}
</script>

<template>
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