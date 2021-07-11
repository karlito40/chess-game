
export const BLACK = 'black'
export const WHITE = 'white'

export const invertColor = (color) => color === BLACK ? WHITE : BLACK

const __ = undefined;

const Piece = (type, color) => ({ type, color })

export const Tower = (color) => Piece('tower', color)
export const Knight = (color) => Piece('knight', color)
export const Bishop = (color) => Piece('bishop', color)
export const King = (color) => Piece('king', color)
export const Queen = (color) => Piece('queen', color)

export const Pawn = (color) => Piece('pawn', color)

export const createBoard = () => {
  return [
    [Tower(BLACK), Knight(BLACK), Bishop(BLACK), Queen(BLACK), Bishop(BLACK), Tower(BLACK)],
    [Pawn(BLACK), Pawn(BLACK), Pawn(BLACK), Pawn(BLACK), Pawn(BLACK), Pawn(BLACK)],
    [__, __, __, __, __, __],
    [__, __, __, __, __, __],
    [__, __, __, __, __, __],
    [__, __, __, __, __, __],
    [Pawn(WHITE), Pawn(WHITE), Pawn(WHITE), Pawn(WHITE), Pawn(WHITE), Pawn(WHITE)],
    [Tower(WHITE), Knight(WHITE), Bishop(WHITE), Queen(WHITE), Bishop(WHITE), Tower(WHITE)],
  ]
}
