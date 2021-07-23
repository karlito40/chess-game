<template>
  <div class="screen-new-game">
    <h2>
      {{ guesser.fullName }} select a face coin
    </h2>

    <p>
      If you guess right, you start.
      Otherwise your opponent start.
    </p>

    <FacePicker v-model="selectedFace" />

    <button
      :disabled="!selectedFace" 
      class="btn"
      @click="send('NEW_GAME', { selectedFace })"
    >
      Let's roll!
    </button>
  </div>
</template>

<script>
import { ref } from 'vue'
import FacePicker from './FacePicker.vue'

export default {
  components: { FacePicker },
  props: {
    guesser: {
      type: Object,
      required: true
    },
    send: {
      type: Function,
      required: true
    }
  },

  setup (props) {
    const selectedFace = ref()

    return { selectedFace }
  }
}
</script>

<style scoped>
.screen-new-game {
  text-align: center;
  background: white;
  border-radius: 5px;
  padding: 1rem
}


h2 {
  margin-top: 0;
  margin-bottom: 1.3rem;
}
</style>