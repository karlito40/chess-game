// import { from } from "rxjs"
import { BLACK, isEatablePiece, getCloserPiece, isPositionInBoard, getPositionFromPiece, arePositionsDifferent } from "./board" // todo: circular deps :'(

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
    const opponentDirection = color === BLACK ? 1 : -1
    const eatingMoves = [{
      x: currentPosition.x - 1,
      y: currentPosition.y + (1 * opponentDirection)
    }, {
      x: currentPosition.x + 1,
      y: currentPosition.y + (1 * opponentDirection)
      // we can only eat if the cell contains a piece
    }].filter((eatingMove) => isEatablePiece(board, eatingMove, color))

    const isFirstMove = color === BLACK ? currentPosition.y === 1 : currentPosition.y === board.length - 2
    const firstMovePosition = {
      x: currentPosition.x,
      y: currentPosition.y + (2 * opponentDirection)
    }
    
    const wallPiece = getCloserPiece(board, currentPosition, { translateY: opponentDirection })
    const wallPosition = getPositionFromPiece(board, wallPiece)
    const basicMove = {
      x: currentPosition.x,
      y: currentPosition.y + (1 * opponentDirection)
    }

    const rules = [
      basicMove,
      ...isFirstMove && [firstMovePosition] || [],
    ]
      .map((position) => applyWall(position, wallPosition))
      .concat(eatingMoves)

    return rules
      .filter((toPosition) => toPosition 
        && isPositionInBoard(board, toPosition) 
        && arePositionsDifferent(currentPosition, toPosition)
      )
  }
})

const applyWall = (toPosition, wallPosition) => {
  if (wallPosition) {
    if (wallPosition.x === toPosition.x && wallPosition.y === toPosition.y) {
      return null
    }
    const newPosition = {
      x: toPosition.x === wallPosition.x 
      ? toPosition.x 
      : toPosition.x > wallPosition.x 
        ? Math.max(toPosition.x, wallPosition.x + 1)
        : Math.min(toPosition.x, wallPosition.x - 1),
      y: toPosition.y === wallPosition.y 
        ? toPosition.y 
        : toPosition.y > wallPosition.y 
          ? Math.max(toPosition.y, wallPosition.y + 1)
          : Math.min(toPosition.y, wallPosition.y - 1)
    }

    return newPosition
  }
  return toPosition
}