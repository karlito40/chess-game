import { createApp } from 'vue'
import * as globalComponents from './global-registry'
import { LOGIC_LAYER } from './constants'
import Draggable from './directives/draggable'
import App from './App.vue'

export default function startLayer ({ logicLayer }) {
  const app = createApp(App)
  app.provide(LOGIC_LAYER, logicLayer)
  app.directive('draggable', Draggable)

  for (const [tag, component] of Object.entries(globalComponents)) {
    app.component(tag, component)
  }

  app.mount('#app-renderer')
  
  return app
}