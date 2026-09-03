import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import DemoApp from './DemoApp.vue'

createApp(DemoApp).use(createVuetify()).mount('#app')
