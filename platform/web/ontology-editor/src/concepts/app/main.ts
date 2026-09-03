import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import DemoApp from './DemoApp.vue'

createApp(DemoApp).use(createVuetify()).mount('#app')
