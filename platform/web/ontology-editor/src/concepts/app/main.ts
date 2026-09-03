import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { ontologyTheme } from '@/concepts/ontology/theme'
import DemoApp from './DemoApp.vue'

createApp(DemoApp).use(createVuetify({ theme: ontologyTheme })).mount('#app')
