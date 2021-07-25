import { createModel } from 'xstate/lib/model'
import { BLACK, WHITE, updateBoard, createFullBoard, movePiece, getCell, getPositionFromPiece } from './board'

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
        fullName: 'Luigi',
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
          FLIP_COIN: {
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
      canSelectPiece: (context, event) => context.currentPlayer.color === event.piece?.color,
      // must also check for "echec"
      canMovePiece: ({ board, selectedPiece }, event) => {
        // TODO: it shouldn't be base on the highlighted status (but i am lazy)
        return Boolean(selectedPiece) && getCell(board, event.to)?.highlighted
      },
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
        board: ({ board, selectedPiece }, event) => {
          const newBoard = [...board]
          const currentPosition = getPositionFromPiece(board, selectedPiece) // TODO: perf
          const validMoves = selectedPiece.getValidMoves(board, currentPosition)
          for (const move of validMoves) {
            const cell = getCell(newBoard, move)
            newBoard[move.y][move.x] = { ...cell, highlighted: true }
          }

          return newBoard
        }
      }),

      removeHighlights: chessModel.assign({
        board: (context, event) => {
          return updateBoard(context.board, (cell) => {
            return { ...cell, highlighted: false }
          })
        }
      }),

      movePiece: chessModel.assign((context, event) => {
        const { to } = event
        const { selectedPiece, board } = context

        return {
          board: movePiece(board, selectedPiece, to),
          selectedPiece: null,
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
