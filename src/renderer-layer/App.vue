<template>
  <div class="app">
    <Game />
  </div>
</template>

<script>
import Game from './pages/Game.vue'

export default {
  components: { Game }
};
</script>

<style>
:root {
  --board-dark-color: #789556;
  --board-light-color: #EBECD0;

  --piece-light-color: rgb(250, 229, 136);
  --piece-dark-color: rgb(136, 146, 175);
}

html { 
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}
*, *:before, *:after { box-sizing: inherit; }
body { margin: 0; }

.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.btn {
  cursor: pointer;
}
</style>

<style scoped>
.app {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f7f4ee;
}
</style>