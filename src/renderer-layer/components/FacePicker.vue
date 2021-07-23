<template>
  <div class="face-picker">
    <!-- TODO: Accessibility -->
    <div 
      v-for="(face, index) in FACES"
      :key="index"
      :data-state="face === modelValue ? 'selected' : 'idle'"
      class="face-input"
      @click="$emit('update:modelValue', face)"
    >
      {{ face }}
    </div>
  </div>
</template>

<script>
import { FACES } from '../../constants'

export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: String
  },

  setup () {
   return {
     FACES
   }
  },
}
</script>

<style scoped>
.face-picker {
  display: flex;
  margin-bottom: 1.3rem;
}

.face-picker .face-input {
  flex: 1;
  padding: 0.4rem;
  margin-right: 0.4rem;
  border-radius: 5px;
  border: 1px solid rgb(173, 173, 173);
  cursor: pointer;
}

.face-picker .face-input:last-child {
  margin-right: 0
}

.face-picker .face-input[data-state='selected'] {
  border: 1px solid black;
}

.face-picker .face-input:hover {
  background: rgb(230, 230, 230);
}
</style>