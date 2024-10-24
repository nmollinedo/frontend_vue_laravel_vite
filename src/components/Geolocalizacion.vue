<template>
    <div class="card">
      <Toast />
      <h1 class="text-3xl font-bold mb-4">Registrar Punto Georreferencial</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="col-span-1">
          <div ref="mapContainer" style="height: 400px; width: 100%;"></div>
        </div>
        <div class="col-span-1">
          <form @submit.prevent="submitForm" class="p-fluid">
            <div class="field">
              <label for="name">Nombre del Punto</label>
              <InputText id="name" v-model="form.name" required autofocus :class="{'p-invalid': v$.form.name.$invalid && submitted}" />
              <small v-if="v$.form.name.$invalid && submitted" class="p-error">El nombre es requerido.</small>
            </div>
            <div class="field">
              <label for="description">Descripción</label>
              <Textarea id="description" v-model="form.description" rows="3" />
            </div>
            <div class="field">
              <label for="latitude">Latitud</label>
              <InputNumber id="latitude" v-model="form.latitude" :minFractionDigits="6" :maxFractionDigits="6" readonly />
            </div>
            <div class="field">
              <label for="longitude">Longitud</label>
              <InputNumber id="longitude" v-model="form.longitude" :minFractionDigits="6" :maxFractionDigits="6" readonly />
            </div>
            <Button type="submit" label="Registrar Punto" class="mt-4" />
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  /*
  import { ref, reactive, onMounted } from 'vue';
  import { useToast } from 'primevue/usetoast';
  //import { useVuelidate } from '@vuelidate/core';
  //import { required } from '@vuelidate/validators';
  import InputText from 'primevue/inputtext';
  import Textarea from 'primevue/textarea';
  import InputNumber from 'primevue/inputnumber';
  import Button from 'primevue/button';
  import Toast from 'primevue/toast';
  //import * as L from 'leaflet';
  //import '/leaflet.css';

  
  const mapContainer = ref(null);
  const toast = useToast();
  const submitted = ref(false);
  
  const form = reactive({
    name: '',
    description: '',
    latitude: null,
    longitude: null,
  });
  
  const rules = {
    form: {
      name: { required },
      latitude: { required },
      longitude: { required },
    },
  };
  
  const v$ = useVuelidate(rules, { form });*/
 /* 
  let map;
  let marker;
  
  onMounted(() => {
    initMap();
  });
  
  function initMap() {
    map = L.map(mapContainer.value).setView([0, 0], 2);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    map.on('click', (event) => {
      placeMarker(event.latlng);
    });
  }
  
  function placeMarker(latlng) {
    if (marker) {
      marker.setLatLng(latlng);
    } else {
      marker = L.marker(latlng).addTo(map);
    }
  
    form.latitude = latlng.lat.toFixed(6);
    form.longitude = latlng.lng.toFixed(6);
  }
  
  async function submitForm() {
    submitted.value = true;
    const isFormCorrect = await v$.value.$validate();
  
    if (isFormCorrect) {
      try {
        // Aquí iría la lógica para enviar los datos al servidor
        // Por ejemplo:
        // await axios.post('/api/geo-points', form);
        
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Punto georreferencial registrado correctamente', life: 3000 });
        
        // Reiniciar el formulario
        Object.keys(form).forEach(key => form[key] = '');
        submitted.value = false;
        if (marker) {
          map.removeLayer(marker);
          marker = null;
        }
      } catch (error) {
        console.error('Error al registrar el punto:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el punto georreferencial', life: 3000 });
      }
    } else {
      toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, complete todos los campos requeridos', life: 3000 });
    }
  }*/
  </script>
  
  <style scoped>
  .p-inputtext, .p-inputnumber, .p-textarea {
    width: 100%;
  }
  </style>