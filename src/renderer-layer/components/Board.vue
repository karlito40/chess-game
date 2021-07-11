<template>
  <div 
    :style="{ '--board-size': board.length }"
    class="board"
  >
    <template v-for="(row, i) in board">
      <div
        v-for="(cell, j) in row"
        :key="`${i}-${j}`"
        :data-id="`${i}-${j}:${(i*board.length)+j}`"
        :data-single-dim-id="(i*board.length)+j"
        class="board__cell"
      >
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    board: {
      type: Array,
      required: true
    }
  },

  setup() {
    
  },
})
</script>

<style scoped>
.board {
  --board-dark-color: #0e0505;
  --board-light-color: white;
  
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid var(--board-dark-color);
}

.board__cell {
  aspect-ratio: 1 / 1;
  background: var(--board-light-color);
}

.board__cell:nth-child(-n+8):nth-child(even) {
  background: var(--board-dark-color);
}

.board__cell:nth-child(n+8):nth-child(-n+16):nth-child(odd) {
  background: var(--board-dark-color);
}

.board__cell:nth-child(n+17):nth-child(-n+24):nth-child(even) {
  background: var(--board-dark-color);
}

.board__cell:nth-child(n+25):nth-child(-n+32):nth-child(odd) {
  background: var(--board-dark-color);
}

.board__cell:nth-child(n+33):nth-child(-n+40):nth-child(even) {
  background: var(--board-dark-color);
}

.board__cell:nth-child(n+41):nth-child(-n+48):nth-child(odd) {
  background: var(--board-dark-color);
}

.board__cell:nth-child(n+49):nth-child(-n+56):nth-child(even) {
  background: var(--board-dark-color);
}

.board__cell:nth-child(n+57):nth-child(-n+64):nth-child(odd) {
  background: var(--board-dark-color);
}
</style>