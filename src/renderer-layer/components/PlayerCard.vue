<template>
  <div class="player-card">
    {{ player.fullName }}
    <div
      :data-color="player.color || ''"
      class="player-color"
    ></div>
  </div>
</template>

<script>

export default {
  props: {
    player: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.player-card {
  position: relative;
  padding: 1rem;
  border: 1px solid black;
  border-radius: 10px;
  margin-bottom: 0.5rem;
}

.player-color {
  position: absolute;
  top: 0;
  left: 0;
  width: 1rem;
  height: 1rem;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

.player-color[data-color="black"] {
  background: var(--piece-dark-color);
}

.player-color[data-color="white"] {
  background: var(--piece-light-color);
}
</style>