import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css'
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"; 

const app = createApp(App);
const pinia = createPinia();

app.use(router)
app.use(PrimeVue);
app.use(pinia);

app.mount('#app')
