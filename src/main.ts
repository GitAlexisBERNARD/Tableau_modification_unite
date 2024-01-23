import './assets/css/main.css'
import './assets/css/base.css'
import './assets/css/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import routes from '~pages'
import { createRouter, createWebHistory } from 'vue-router'
import V3ScrollLock from 'v3-scroll-lock';
const app = createApp(App)
app.use(V3ScrollLock, {})
app.use(
  createRouter({
    history: createWebHistory(),
    routes
  })
)

app.mount('#app')
