<template>
  <div
    class="player-card"
    :data-status="isPlaying ? 'playing' : 'idle'"
    :data-color="player.color || ''"
  >
    {{ player.fullName }}
  </div>
</template>

<script>

export default {
  props: {
    player: {
      type: Object,
      required: true
    },
    isPlaying: Boolean
  }
}
</script>

<style scoped>
.player-card {
  position: relative;
  padding: 1rem;
  border-left: 4px solid #ccc;
  margin-bottom: 0.8rem;
}

.player-card[data-status='playing'] {
  border-left: 4px solid red; 
}

.player-card[data-color="black"] {
  background: var(--piece-dark-color);
}

.player-card[data-color="white"] {
  background: var(--piece-light-color);
}
</style>