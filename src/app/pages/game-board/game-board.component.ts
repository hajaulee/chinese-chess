import {Component, OnInit} from '@angular/core';
import {isEqual} from "lodash";
import {ChessMan, ChessManPosition, ChessMove, ChineseChessGameEngine} from "../../library/chinese-chess-game-engine";
import {GameTurn} from "../../library/game-turn";
import {ChineseChessEvaluator} from "../../library/chinese-chess-evaluator";
import {GameAi} from "../../library/game-ai";

export interface ClickedChessMan {
  rowIndex: number;
  colIndex: number;
  chessMan: ChessMan;
}

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

  // Constants
  gameTurn = GameTurn;

  gameEngine!: ChineseChessGameEngine;
  gameEvaluator!: ChineseChessEvaluator;
  gameAi!: GameAi<ChineseChessGameEngine, ChessMove>;
  clickedChessMan?: ClickedChessMan = undefined;
  nextPositionHints: Array<ChessManPosition> = [];

  maxDepth = 4;

  constructor() {
  }

  ngOnInit(): void {
    this.initGame();
  }

  initGame(){
    this.gameEngine = new ChineseChessGameEngine(GameTurn.RED);
    this.gameEvaluator = new ChineseChessEvaluator();
    this.gameAi = new GameAi(this.gameEngine, this.gameEvaluator, this.maxDepth);
  }


  chessManClick(rowIndex: number, colIndex: number, chessMan?: ChessMan | null) {
    if (!this.clickedChessMan) {
      this.setClickedChessMan(rowIndex, colIndex, chessMan);
    } else {
      if (this.isValidNextPosition(colIndex, rowIndex)) {
        this.humanMove(rowIndex, colIndex);
        setTimeout(() => this.aiMove());
      } else if (chessMan) {
        this.setClickedChessMan(rowIndex, colIndex, chessMan);
      }
    }
  }

  humanMove(rowIndex: number, colIndex: number){
    this.gameEngine.move({
      from: {x: this.clickedChessMan!.colIndex, y: this.clickedChessMan!.rowIndex},
      to: {x: colIndex, y: rowIndex}
    });
    this.clickedChessMan = undefined;
    this.nextPositionHints = [];
  }

  aiMove() {
    const aiMove = this.gameAi.infer();
    if (aiMove){
      this.gameEngine.move(aiMove);
    }else{
      alert("No move");
    }
  }

  setClickedChessMan(rowIndex: number, colIndex: number, chessMan?: ChessMan | null) {
    if (chessMan && chessMan.color == GameTurn.RED) {
      this.clickedChessMan = {rowIndex, colIndex, chessMan};
      this.nextPositionHints = this.gameEngine.ableNextPositions(colIndex, rowIndex);
    }
  }

  isValidNextPosition(x: number, y: number): boolean {
    return this.nextPositionHints.some(it => it.x == x && it.y == y)
  }

  undo(){
    this.gameEngine.undo()
  }
}
