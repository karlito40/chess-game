export default {
  mounted (el, binding) {
    Draggable(el, binding.value)
  },

  updated (el, binding) {
    el.__destroyDraggableDirective()
    Draggable(el, binding.value)
  },

  beforeUnmount (el) {
    el.__destroyDraggableDirective()
  }
}

function Draggable (el, { onStart, onEnd } = {}) {
  const createPointerUp = () => document.body.addEventListener('pointerup', onPointerUp, false)
  const removePointerUp = () => document.body.removeEventListener('pointerup', onPointerUp, false)
     
  const onPointerDown = () => {
    createPointerUp()
    onStart?.()
  }
  const onPointerUp = () => {
    removePointerUp()
    onEnd?.()
  }

  el.addEventListener('pointerdown', onPointerDown, false)

  el.__destroyDraggableDirective = () => {
    el.removeEventListener('pointerdown', onPointerDown, false)
    removePointerUp()
    el.__destroyDraggableDirective = undefined
  }
}
