<template>
  <div class="screen-coin-result">
    {{ whitePlayer.fullName }} start!
  </div>
</template>

<script>
export default {
  props: {
    whitePlayer: {
      type: Object,
      required: true
    }
  }
}
</script>