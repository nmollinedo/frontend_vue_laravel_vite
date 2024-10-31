<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Coordinate } from 'ol/coordinate'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { fromLonLat, transform } from 'ol/proj'
import { Style, Circle, Fill, Stroke } from 'ol/style'

const emit = defineEmits<{
  (e: 'update:coordinates', value: { lat: number; lon: number }): void
}>()

const center = ref<Coordinate>([-77.0369, -12.0864])
const zoom = ref(11)
const rotation = ref(0)
const projection = ref('EPSG:4326')
const markerFeature = ref<Feature>(new Feature())
const features = ref<Feature[]>([])

const markerStyle = new Style({
  image: new Circle({
    radius: 8,
    fill: new Fill({ color: '#ff0000' }),
    stroke: new Stroke({
      color: '#ffffff',
      width: 2
    })
  })
})

const handleMapClick = (event: any) => {
  const coords = event.coordinate
  updateMarkerPosition(coords)
  emit('update:coordinates', {
    lat: coords[1],
    lon: coords[0]
  })
}

const updateMarkerPosition = (coords: Coordinate) => {
  markerFeature.value.setGeometry(new Point(coords))
  features.value = [markerFeature.value]
}

const getCurrentLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const coords: Coordinate = [position.coords.longitude, position.coords.latitude]
      center.value = coords
      zoom.value = 15
      updateMarkerPosition(coords)
      emit('update:coordinates', {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      })
    }, (error) => {
      console.error('Geolocation error:', error)
    })
  }
}

onMounted(() => {
  markerFeature.value.setStyle(markerStyle)
})
</script>

<template>
  <div class="map-container">
    <Button 
      icon="pi pi-map-marker"
      @click="getCurrentLocation"
      class="locate-button p-button-rounded p-button-info"
      title="Get Current Location"
    />
    
    <ol-map
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      style="height: 400px"
      @click="handleMapClick"
    >
      <ol-view
        ref="view"
        :center="center"
        :rotation="rotation"
        :zoom="zoom"
        :projection="projection"
      />

      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>

      <ol-vector-layer>
        <ol-source-vector :features="features" />
      </ol-vector-layer>
    </ol-map>
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
}

.locate-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}
</style>