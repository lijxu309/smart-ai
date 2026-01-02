import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './firebase'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

// Initialize Pinia
app.use(createPinia())

// Initialize Vue Router
app.use(router)

// Initialize VueFire
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
})

app.mount('#app')
