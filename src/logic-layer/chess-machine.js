import { actions } from 'xstate'
import { createModel } from 'xstate/lib/model'
import { BLACK, createBoard, WHITE , invertColor } from './board'

const FIFTEEN_MIN_IN_SEC = 60 * 15

// actionManager 
//   // history
// actionManager.execute(new MoveCommand(piece))

export default (/* internalDeps */) => (/* options */) => {
  const chessModel = createModel({
    board: createBoard(),
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
          NEW_GAME: 'flipping_coin'
        }
      },

      flipping_coin: {
        invoke: {
          id: 'flip_a_coin',
          src: 'flipACoin',
          onDone: {
            target: 'playing',
            actions: ['determineWhitePlayer']
          }
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
    actions: {
      selectPiece: chessModel.assign({
        selectedPiece: (_, event) =>  event.value
      }),

      initBoard: chessModel.assign({
        board: createBoard
      })
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
