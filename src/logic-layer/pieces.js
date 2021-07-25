// import { from } from "rxjs"
import { WHITE, isEatablePiece } from "./board" // todo: circular deps :'(

const ID = (() => {
  let id = 0
  return () => {
    return id++
  }
})()

const Piece = (type, color) => ({
  type,
  color,
  id: ID(),
  getValidMoves: (board, currentPosition) => { throw new Error('getValidMoves must be implemented') }
})

export const Tower = (color) => Piece('tower', color)
export const Knight = (color) => Piece('knight', color)
export const Bishop = (color) => Piece('bishop', color)
export const King = (color) => Piece('king', color)
export const Queen = (color) => Piece('queen', color)

export const Pawn = (color) => ({
  ...Piece('pawn', color),
  getValidMoves: (board, currentPosition) => {
    // The white color is the reference color
    const colorDirection = color === WHITE ? 1 : -1
    // TODO: JUMP
    const eatingPositions = [{
      x: currentPosition.x - 1,
      y: currentPosition.y - (1 * colorDirection)
    }, {
      x: currentPosition.x + 1,
      y: currentPosition.y - (1 * colorDirection)
      // we can only eat if the cell contains a piece
    }].filter((eatingPosition) => isEatablePiece(board, eatingPosition, color))

    const isFirstMove = color === WHITE ? currentPosition.y === board.length - 2 : currentPosition.y === 1 
    const firstMovePosition = {
      x: currentPosition.x,
      y: currentPosition.y - (2 * colorDirection)
    }

    const rules = [
      {
        x: currentPosition.x,
        y: currentPosition.y - (1 * colorDirection)
      },
      ...eatingPositions,
      ...isFirstMove && [firstMovePosition] || [],
    ]

    return rules.filter((toPosition) => isPositionInside(board, toPosition))
  }
})


const isPositionInside = (board, position) => {
  const size = board.length; // a board is a square
  return (position.x >= 0 && position.x < size) 
    || (position.y >= 0 && position.y < size)
}

