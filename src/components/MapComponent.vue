<script setup lang="ts">
import { ref } from 'vue'
import type { Coordinate } from 'ol/coordinate'

const emit = defineEmits<{
  (e: 'update:coordinates', value: { lat: number; lon: number }): void
}>()

const center = ref<Coordinate>([-77.0369, -12.0864])
const zoom = ref(11)
const rotation = ref(0)
const projection = ref('EPSG:4326')

const handleMapClick = (event: any) => {
  const coords = event.coordinate
  emit('update:coordinates', {
    lat: coords[1],
    lon: coords[0]
  })
}
</script>

<template>
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
  </ol-map>
</template>