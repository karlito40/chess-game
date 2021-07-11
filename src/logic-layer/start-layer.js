import makeChessMachine from './chess-machine'

export default function startLayer () {
  const internalDeps = {}

  return {
    ChessMachine: makeChessMachine(internalDeps)
  }
}