import {GameEngine, GameMove} from "./game-engine";
import {GameEvaluator} from "./game-evaluator";

export class GameAi<GenericGame extends GameEngine, GenericMove extends GameMove> {

  constructor(private gameEngine: GenericGame, private gameEvaluator: GameEvaluator<GenericGame>, private maxDepth: number) {
  }

  infer(): GenericMove | null {
    const bestMove = this.minimax(this.gameEngine, null, 0 , false, -Infinity, Infinity);
    console.log("best move:", bestMove.move, bestMove.value)
    return bestMove.move as GenericMove;
  }

  private minimax(
    gameEngine: GenericGame,
    currentMove: GameMove | null,
    depth: number,
    isMaxPlayer: boolean,
    alpha: number,
    beta: number
  ): { move: GameMove | null, value: number } {
    if (depth == this.maxDepth || this.gameEvaluator.isTerminate(gameEngine)) {
      return {move: currentMove, value: this.gameEvaluator.evaluate(gameEngine)};
    }

    if (isMaxPlayer) {
      let bestVal = -Infinity;
      let bestMove = null;
      for (const move of gameEngine.ableMoves()) {
        const nextState = gameEngine.clone() as GenericGame;
        nextState.move(move)
        const {value} = this.minimax(nextState, move, depth + 1, false, alpha, beta);
        if (value > bestVal){
          bestVal = value;
          bestMove = move;
        }
        alpha = Math.max(alpha, bestVal)
        if (beta <= alpha){
          break;
        }
      }
      return {move: bestMove, value: bestVal};
    } else {
      let bestVal = Infinity;
      let bestMove = null;

      for (const move of gameEngine.ableMoves()) {
        const nextState = gameEngine.clone() as GenericGame;
        nextState.move(move)
        const {value} = this.minimax(nextState, move, depth + 1, true, alpha, beta);
        if (value < bestVal){
          bestVal = value;
          bestMove = move;
        }
        beta = Math.min(beta, bestVal)
        if (beta <= alpha){
          break;
        }
      }
      return {move: bestMove, value: bestVal};
    }
  }

}
