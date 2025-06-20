/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '@/router'
import { store } from '../store/store'
import { createVuetify } from 'vuetify'


export function registerPlugins(app) {
  app
    .use(vuetify)
    .use(router)
    .use(store)
}

export default createVuetify({
  theme: {
    defaultTheme: 'light'
  }
})
