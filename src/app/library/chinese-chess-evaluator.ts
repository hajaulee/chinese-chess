import {GameEvaluator} from "./game-evaluator";
import {ChessManCode, ChineseChessGameEngine} from "./chinese-chess-game-engine";
import {GameTurn} from "./game-turn";

export class ChineseChessEvaluator implements GameEvaluator<ChineseChessGameEngine> {
  evaluate(game: ChineseChessGameEngine): number {
    return this.sumArray(game.board.map(row => this.sumArray(row.filter(cell => !!cell).map(cell => cell!.value))))
  }

  isTerminate(game: ChineseChessGameEngine): boolean {
    return !game.board.some(row => row.some(cell => cell?.color == GameTurn.RED && cell?.code == ChessManCode.tuong)) ||
      !game.board.some(row => row.some(cell => cell?.color == GameTurn.BLACK && cell?.code == ChessManCode.tuong));
  }

  sumArray(arr: Array<number>): number {
    return arr.reduce((acc, it) => {
      acc+= it;
      return acc;
    }, 0)
  }

}
