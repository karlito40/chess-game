import startDebugLayer from './debug-layer/start-layer'
import startLogicLayer from './logic-layer/start-layer'
import startRendererLayer from './renderer-layer/start-layer'

startDebugLayer()

const logicLayer = startLogicLayer()

startRendererLayer({
  logicLayer
})