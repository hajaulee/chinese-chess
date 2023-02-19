export interface GameMove {
}

export interface GameEngine {
  ableMoves(): Array<GameMove>;
  move(move: GameMove): void;
  clone(): GameEngine;
}
