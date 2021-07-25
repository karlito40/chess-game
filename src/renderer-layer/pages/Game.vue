<template>
  <div class="game">
    <div
      v-if="state.value === 'prevent_funny_vue3_xstate_bug'"
    >
      Preventing duplicate idle state execution...
    </div>
    <div
      v-else 
      class="game__scene"
    >
      <Board
        :board="state.context.board"
        :selectedPiece="state.context.selectedPiece"
        @grab="send('GRAB_PIECE', { piece: $event })"
        @release="send('RELEASE_PIECE', { to: $event })"
      />
      <div
        v-if="!state.matches('playing')"
        class="game__overlay"
      >
        <ScreenNewGame
          v-if="state.value === 'idle'"
          :guesser="state.context.players[0]"
          @submit="send('FLIP_COIN', { selectedFace: $event })"
        />
        <ScreenFlippingCoin v-else-if="state.value === 'flipping_coin'" />
        <ScreenCoinResult
          v-else-if="state.value === 'coin_result'" 
          :whitePlayer="state.context.currentPlayer"
        />
      </div>
    </div>

    <div class="game__players">
      <PlayerCard 
        v-for="player in state.context.players"
        :key="player.id"
        :player="player"
        :isPlaying="player === state.context.currentPlayer"
      />
    </div>
  </div>
</template>

<script>
import { useMachine } from '@xstate/vue'
import { useLogicLayer } from '../hooks'
import Board from '../components/Board.vue'
import ScreenNewGame from '../components/ScreenNewGame.vue'
import ScreenFlippingCoin from '../components/ScreenFlippingCoin.vue'
import ScreenCoinResult from '../components/ScreenCoinResult.vue'
import PlayerCard from '../components/PlayerCard.vue'

export default {
  components: {
    Board,
    ScreenNewGame,
    ScreenFlippingCoin,
    ScreenCoinResult,
    PlayerCard
  },
  setup() {
    const { ChessMachine } = useLogicLayer()
    const { state, send } = useMachine(ChessMachine(), {
      devTools: true
    })

    return {
      state,
      send,
    };
  }
};
</script>

<style scoped>
.game {
  display: flex;
}

.game__scene {
  position: relative;
  margin-right: 3rem;
}

.game__overlay { 
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.board {
  /* TODO: resposive */
  width: 600px;
}
</style>