
export const BLACK = 'black'
export const WHITE = 'white'

export const invertColor = (color) => color === BLACK ? WHITE : BLACK

const Cell = (piece) => ({
  highlighted: false,
  piece
});

const Piece = (type, color) => ({ type, color })

export const Tower = (color) => Piece('tower', color)
export const Knight = (color) => Piece('knight', color)
export const Bishop = (color) => Piece('bishop', color)
export const King = (color) => Piece('king', color)
export const Queen = (color) => Piece('queen', color)

export const Pawn = (color) => Piece('pawn', color)

export const createBoard = () => {
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
