import { createApp } from 'vue'
import { createPinia } from 'pinia'

import VWave from 'v-wave'

import './style/style.scss'

import './style/warning.scss'
import './style/header.scss'
import './style/footer.scss'

import './style/home.scss'

import './style/auth.scss'
import './style/dashboard.scss'
import './style/transaction.scss'

import './style/viewports.scss'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VWave, {})

app.mount('#app')
