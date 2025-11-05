import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
// Estilos para alertas personalizadas (tema oscuro)
import './assets/alerts.css'

// Evitar que el navegador restaure automáticamente la posición de scroll al recargar
if ('scrollRestoration' in window.history) {
	window.history.scrollRestoration = 'manual'
}

const app = createApp(App)
app.use(router)

router.isReady().then(() => {
	// En el primer render (recarga), ir SIEMPRE al tope sin importar la ruta
	window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
})

app.mount('#app')