import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style/style.scss'
import './style/header.scss'
import './style/login.scss'
import './style/dashboard.scss'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
