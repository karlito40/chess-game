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
        :data-x="j"
        :data-y="i"
        :data-highlighted="cell.highlighted"
        :ondrop="(event) => drop(event)"
        :ondragover="(event) => allowDrop(event)"
        class="cell"
      >
        <div
          v-if="cell.piece"
          :data-id="cell.piece.id"
          :data-color="cell.piece.color"
          :data-status="selectedPiece?.id === cell.piece.id ? 'selected' : 'idle'"
          :ondragstart="(event) => drag(event, cell.piece)"
          class="piece"
          draggable="true"
        >
          {{ cell.piece.type }}
        </div>
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
    },
    selectedPiece: Object
  },

  methods: {
    drag (event, piece) {
      this.$emit('grab', piece)
    },

    drop (event) {
      event.preventDefault()
      this.$emit('release', {
        x: parseInt(event.target.dataset.x, 10),
        y: parseInt(event.target.dataset.y, 10),
      })
    },

    allowDrop (event) {
      event.preventDefault()
    }
  }
})
</script>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  overflow: hidden;
  border: 2px solid var(--board-dark-color);
  user-select: none;
}

.cell {
  aspect-ratio: 1 / 1;
  background: var(--board-light-color);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell[data-highlighted="true"]:before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(170, 7, 219, 0.6);
  pointer-events: none;
}

.cell:nth-child(-n+8):nth-child(even) {
  background: var(--board-dark-color);
}

.cell:nth-child(n+8):nth-child(-n+16):nth-child(odd) {
  background: var(--board-dark-color);
}

.cell:nth-child(n+17):nth-child(-n+24):nth-child(even) {
  background: var(--board-dark-color);
}

.cell:nth-child(n+25):nth-child(-n+32):nth-child(odd) {
  background: var(--board-dark-color);
}

.cell:nth-child(n+33):nth-child(-n+40):nth-child(even) {
  background: var(--board-dark-color);
}

.cell:nth-child(n+41):nth-child(-n+48):nth-child(odd) {
  background: var(--board-dark-color);
}

.cell:nth-child(n+49):nth-child(-n+56):nth-child(even) {
  background: var(--board-dark-color);
}

.cell:nth-child(n+57):nth-child(-n+64):nth-child(odd) {
  background: var(--board-dark-color);
}

.piece {
  border-radius: 5px;
  background: #b1b1b1;
  font-weight: bold;
  padding: 0.3rem;
}

.piece[data-color="black"] {
  background: var(--piece-dark-color);
  color: rgb(0, 0, 0);
}

.piece[data-color="white"] {
  background: var(--piece-light-color);
  color: rgb(175, 118, 11);
}

.piece[data-status="selected"] {
  border: 1px solid red;
}
</style>