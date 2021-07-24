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

    board: null,
    selectedPiece: null,
    currentPlayer: null,
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
    initial: 'prevent_funny_vue3_xstate_bug', // TODO: investigate this
    states: {
      prevent_funny_vue3_xstate_bug: {
        after: {
          50: 'idle'
        }
      },
      idle: {
        entry: ['initBoard'],
        on: {
          COIN: {
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
          1100: 'playing'
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
          NEW_GAME: 'idle',
          VIEW_REPLAY: 'analyze'
        }
      },

      analyze: {
        NEW_GAME: 'flipping_coin'
      }
    }
  }, {
    guards: {
      canSelectPiece: (context, event) => event.piece?.color === context.currentPlayer.color,
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
        return { coinFace: rand ? 'heads' : 'tails' }
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

      determineWhitePlayer: chessModel.assign((context, event) => {
        const { coinFace } = event.data
        const didP1GuessRight = context.selectedCoinFace === coinFace
        const players = [
          {
           ...context.players[0],
            color: didP1GuessRight ? WHITE : BLACK
          },
          {
            ...context.players[1],
            color: !didP1GuessRight ? WHITE : BLACK
          },
        ]
        const currentPlayer = players.find(player => player.color === WHITE)

        return {
          players,
          currentPlayer
        }
      }),

      selectPiece: chessModel.assign({
        selectedPiece: (_, event) =>  event.piece
      }),

      nextPlayerTurn: chessModel.assign({
        currentPlayer: (context, event) => context.players.find(player => player.id !== context.currentPlayer.id)
      }),

      highlightValidMoves: chessModel.assign({
        board: (context, event) => {
          return context.board.map((row, i) => {
            return row.map((cell, j) => {
              // TODO: move
              if (cell.piece === context.selectedPiece) {
                return { ...cell, highlighted: true }
              }

              return cell
            })
          })
        }
      }),
    }
  });
  
}

const PlayingState = () => {
  // todo: handle timer (go to result and defineWinner when the timer is reached)
  return {
    initial: 'turn',
    states: {
      turn: {
        entry: ['startCurrentTimer'],
        exit: ['pauseCurrentTimer', 'nextPlayerTurn', 'removeHighlights'],
        on: {
          ASK_FOR_DRAW: '#deliberating_on_draw',
          FORFEIT: '#result',
          GRAB_PIECE: {
            cond: 'canSelectPiece',
            actions: ['selectPiece', 'highlightValidMoves']
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
              target: 'turn'
            }
          ]
        }
      },
      // [`${BLACK}_turn`]: TurnState(BLACK),
    },
  }
}
