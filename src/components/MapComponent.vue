<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'
import type { Coordinate } from 'ol/coordinate'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { fromLonLat, toLonLat } from 'ol/proj'
import { Style, Icon } from 'ol/style'
import transferenciaService from '../services/transferencia.service'

// Importa la imagen desde assets
import marcadorIcono from '../assets/images/marcadorMapa.png'

const emit = defineEmits<{
  (e: 'update:coordinates', value: { lat: number; lon: number }): void
}>()

const props = defineProps<{
  idTransferencia: number | null
}>()

const center = ref<Coordinate>(fromLonLat([-77.0369, -12.0864]))
const initialZoom = 12 // Zoom inicial solo para la primera carga
const userZoom = ref<number | null>(null) // Almacena el zoom actual del usuario o el inicial solo en la primera carga
const rotation = ref(0)
const projection = ref('EPSG:3857')

const markerFeature = new Feature()
const features = ref([markerFeature])

// Estilo del marcador usando la imagen importada
const markerStyle = new Style({
  image: new Icon({
    src: marcadorIcono,
    scale: 0.09,
    anchor: [0.5, 1]
  })
})

const handleMapClick = (event: any) => {
  const coords = toLonLat(event.coordinate)
  updateMarkerPosition(coords)
  center.value = fromLonLat(coords)

  // No modificar el zoom actual del usuario
  if (!userZoom.value) {
    userZoom.value = initialZoom
  }

  emit('update:coordinates', {
    lat: coords[1],
    lon: coords[0]
  })

  console.log("Nueva posición del marcador:", coords)
}

const updateMarkerPosition = (coords: Coordinate) => {
  markerFeature.setGeometry(new Point(fromLonLat(coords)))
  markerFeature.setStyle(markerStyle)
}

const getCurrentLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const coords: Coordinate = [position.coords.longitude, position.coords.latitude]
      center.value = fromLonLat(coords)

      // Aplica zoom inicial solo si no se ha establecido un zoom personalizado
      if (!userZoom.value) {
        userZoom.value = initialZoom
      }

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

const loadLocations = async () => {
  try {
    const response = await transferenciaService.listarPunto(props.idTransferencia)
    const locations = response.data

    if (locations.length > 0) {
      const location = locations[0]

      // Asignar valores por defecto si las coordenadas son nulas
      const lat = location.latitud !== null ? location.latitud : '-16.502373';
      const lon = location.longitud !== null ? location.longitud : '-68.147049';

      const coords = [lon, lat];
      center.value = fromLonLat(coords)

      // Solo establece el zoom inicial la primera vez
      if (!userZoom.value) {
        userZoom.value = initialZoom
      }

      // Verificar si las coordenadas son válidas para actualizar el marcador
      if (location.latitud !== null && location.longitud !== null) {
        updateMarkerPosition(coords)
        emit('update:coordinates', {
          lat: lat,
          lon: lon
        })
      } else {
        // Si las coordenadas son nulas, no actualiza el marcador
        markerFeature.setGeometry(null); // Esto asegura que no se muestre el marcador
      }
    }
  } catch (error) {
    console.error('Error al cargar ubicaciones:', error)
  }
}

onMounted(() => {
  loadLocations()
  markerFeature.setStyle(markerStyle)
})
</script>

<template>
  <div class="map-container">
    <Button icon="pi pi-map-marker" @click="getCurrentLocation" class="locate-button p-button-rounded p-button-info"
      title="Obtener Ubicación Actual" />

    <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height: 400px"
      @click="handleMapClick">
      <ol-view ref="view" :center="center" :rotation="rotation" :zoom="userZoom || initialZoom"
        :projection="projection" />

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
