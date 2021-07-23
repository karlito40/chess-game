import { createModel } from 'xstate/lib/model'
import { BLACK, WHITE , invertColor, createFullBoard, createEmptyBoard } from './board'

const FIFTEEN_MIN_IN_SEC = 60 * 15

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// actionManager 
//   // history
// actionManager.execute(new MoveCommand(piece))

export default (/* internalDeps */) => (/* options */) => {
  const chessModel = createModel({
    // Todo: move that stuff in a flip machine
    selectedCoinFace: null,
    flippedCoinFace: null,

    board: createFullBoard(),
    selectedPiece: null,
    players: [
      {
        id: 1,
        fullName: 'John cena',
        timeLeft: FIFTEEN_MIN_IN_SEC,
        color: null
      },
      {
        id: 2,
        fullName: 'Mario',
        timeLeft: FIFTEEN_MIN_IN_SEC,
        color: null
      }
    ]
  })

  return chessModel.createMachine({
    id: 'chess-game',
    initial: 'idle',
    states: {
      idle: {
        on: {
          NEW_GAME: {
            target: 'flipping_coin',
            actions: ['selectCoinFace']
          }
        }
      },

      flipping_coin: {
        invoke: {
          id: 'flip_a_coin',
          src: 'flipACoin',
          onDone: {
            target: 'coin_result',
            actions: ['setFlippedCoinFace', 'determineWhitePlayer']
          }
        }
      },

      coin_result: {
        after: {
          3000: 'playing'
        }
      },

      playing: PlayingState(),

      deliberating_on_draw: {
        id: 'deliberating_on_draw',
        on: {
          ANSWER: [
            { cond: 'isAgreeToDraw', target: 'result' },
            { target: 'playing' },
          ]
        }
      },
    
      result: {
        id: 'result',
        entry: ['defineWinner'],
        on: {
          NEW_GAME: 'flipping_coin',
          VIEW_REPLAY: 'analyze'
        }
      },

      analyze: {
        NEW_GAME: 'flipping_coin'
      }
    }
  }, {
    guards: {
      // must also check for "echec"
      canMovePiece: (context, event) => true,
      // + canMovePiece
      willCheckmate: (context, event) => false
    },

    services: {
      flipACoin: async (context, event) => {
        const fallDuration = 1000
        await sleep(fallDuration)

        const rand = Math.random() > 0.5 
        return Promise.resolve({ coinFace: rand ? 'heads' : 'tails' })
      },
    },

    actions: {
      initBoard: chessModel.assign({
        board: createFullBoard
      }),

      selectCoinFace: chessModel.assign({
        selectedCoinFace: (context, event) => event.selectedFace
      }),
      
      setFlippedCoinFace: chessModel.assign({
        flippedCoinFace: (context, event) => event.data.coinFace
      }),

      determineWhitePlayer: chessModel.assign({
        players: (context, event) => {
          const { coinFace } = event.data
          const didP1GuessRight = context.selectedCoinFace === coinFace
          return [
            {
              ...context.players[0],
              color: didP1GuessRight ? WHITE : BLACK
            },
            {
              ...context.players[1],
              color: !didP1GuessRight ? WHITE : BLACK
            }
          ]
        }
      }),

      selectPiece: chessModel.assign({
        selectedPiece: (_, event) =>  event.value
      }),
    }
  });
  
}

const PlayingState = () => {
  // todo: handle timer (go to result and defineWinner when the timer is reached)
  const TurnState = (colorState) => {
    return {
      entry: ['startTimer'],
      exit: ['pauseTimer', 'removeEveryHighlights'],
      on: {
        ASK_FOR_DRAW: '#deliberating_on_draw',
        FORFEIT: '#result',
        GRAB_PIECE: {
          actions: ['selectPiece', 'highlightValidMove']
        },
        RELEASE_PIECE: [
          {
            cond: 'willCheckmate',
            target: '#result',
            actions: ['movePiece']
          },
          {
            cond: 'canMovePiece',
            actions: ['movePiece'],
            target: `${invertColor(colorState)}_turn`
          },
          {
            actions: ['highlightInvalidMode']
          },
        ]
      }
    }
  }
  return {
    initial: `${WHITE}_turn`,
    entry: ['initBoard'],
    states: {
      [`${WHITE}_turn`]: TurnState(WHITE),
      [`${BLACK}_turn`]: TurnState(BLACK),
    },
    on: {
      // we could share the GRAB, RELEASE and FORFEIT events here
      // but the visualizer became harder to read
    },
  }
}
