import { createApp } from 'vue'
// import './style.css'

import App from './App.vue'
import router from './router'

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import OpenLayersMap from 'vue3-openlayers'

import 'vue3-openlayers/dist/vue3-openlayers.css'

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const app = createApp(App);

app.use(router)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});

app.use(ToastService);
app.use(OpenLayersMap);
app.use(ConfirmationService);

app.mount('#app')
