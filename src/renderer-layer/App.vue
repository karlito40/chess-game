<template>
  <div class="app">
    <Board :board="state.context.board"/>
  </div>
</template>

<script>
import { useMachine } from '@xstate/vue';
import { useLogicLayer } from './hooks';

export default {
  setup() {
    const { ChessMachine } = useLogicLayer()
    const { state, send } = useMachine(ChessMachine(), {
      devTools: true
    })

    return {
      state,
      send
    };
  }
};
</script>

<style>
html { box-sizing: border-box; }
*, *:before, *:after { box-sizing: inherit; }
body { margin: 0; }
</style>

<style scoped>
.app {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f7f4ee;
}

.board {
  width: 700px;
}
</style>