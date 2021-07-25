// import { Observable } from 'rxjs'
import { Tower, Knight, Bishop, King, Queen, Pawn } from './pieces'

export const BLACK = 'black'
export const WHITE = 'white'

export const invertColor = (color) => color === BLACK ? WHITE : BLACK

const Cell = (piece) => ({
  highlighted: false,
  piece
});

export const createFullBoard = () => {
  return [
    [Cell(Tower(BLACK)), Cell(Knight(BLACK)), Cell(Bishop(BLACK)), Cell(Queen(BLACK)), Cell(King(BLACK)), Cell(Bishop(BLACK)), Cell(Knight(BLACK)), Cell(Tower(BLACK))],
    [Cell(Pawn(BLACK)), Cell(Pawn(BLACK)), Cell(Pawn(BLACK)), Cell(Pawn(BLACK)), Cell(Pawn(BLACK)), Cell(Pawn(BLACK)), Cell(Pawn(BLACK)), Cell(Pawn(BLACK))],
    [Cell(), Cell(), Cell(), Cell(), Cell(), Cell(), Cell(), Cell()],
    [Cell(), Cell(), Cell(), Cell(), Cell(), Cell(), Cell(), Cell()],
    [Cell(), Cell(), Cell(), Cell(), Cell(), Cell(), Cell(), Cell()],
    [Cell(), Cell(), Cell(), Cell(), Cell(), Cell(), Cell(), Cell()],
    [Cell(Pawn(WHITE)), Cell(Pawn(WHITE)), Cell(Pawn(WHITE)), Cell(Pawn(WHITE)), Cell(Pawn(WHITE)), Cell(Pawn(WHITE)), Cell(Pawn(WHITE)), Cell(Pawn(WHITE))],
    [Cell(Tower(WHITE)), Cell(Knight(WHITE)), Cell(Bishop(WHITE)), Cell(Queen(WHITE)), Cell(King(WHITE)), Cell(Bishop(WHITE)), Cell(Knight(WHITE)), Cell(Tower(WHITE))],
  ]
}

export const createEmptyBoard = () => {
  return Array.from({ length: 8 }, () => 
    Array.from({ length: 8 }, (v, j) => Cell())
  )
}

export function updateBoard (board, cb) {
  return board.map((row, y) => {
    return row.map((cell, x) => {
      return cb(cell, x, y)
    })
  })
}

export const removePiece = (board, targetedPiece) => {
  return updateBoard(board, (cell) => {
    if (cell.piece === targetedPiece) {
      return { ...cell, piece: null }
    }

    return cell
  })
}

export const addPiece = (board, piece, position) => {
  return updateBoard(board, (cell, x, y) => {
    if (position.x === x && position.y === y) {
      return { ...cell, piece }
    }

    return cell;
  })
}

export const movePiece = (board, piece, position) => {
  return addPiece(
    removePiece(board, piece),
    piece,
    position
  )
}

export const getCell = (board, position) => board[position.y][position.x]
export const getPiece = (board, position) => board[position.y]?.[position.x]?.piece
export const getPiecePosition = (board, piece) => {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x].piece === piece) {
        return { x, y }
      }
    }
  }
  return null
}
export const isEmptyCell = (board, position) => Boolean(getPiece(position, board))
export const isEatablePiece = (board, position, myColor) => {
  const piece = getPiece(board, position)
  return piece && piece.color !== myColor
}

// export const withBoard = (board) => ({
//   createFull: createFullBoard.bind(undefined, board),
//   createEmpty: createEmptyBoard.bind(undefined, board),
//   update: updateBoard.bind(undefined, board),
//   removePiece: removePiece.bind(undefined, board),
//   addPiece: removePiece.bind(undefined, board),
//   movePiece: movePiece.bind(undefined, board)
// })