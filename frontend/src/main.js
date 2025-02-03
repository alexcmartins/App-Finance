import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount('#app');

// Registra o Service Worker para o PWA
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then(() => {
        console.log("Service Worker registrado com sucesso!");
      }).catch((err) => {
        console.error("Erro ao registrar Service Worker:", err);
      });
    });
  }
