import { Component, OnInit } from '@angular/core';
import {ChessMan, ChessManPosition, GameEngine, GameTurn} from "../../library/game-engine";
import { isEqual } from "lodash";

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

  gameEngine!: GameEngine;
  clickedChessMan?: ClickedChessMan = undefined;
  nextPositionHints: Array<ChessManPosition> = []

  constructor() { }

  ngOnInit(): void {
    this.gameEngine = new GameEngine(GameTurn.RED);
  }


  drawGameBoard(){

  }

  chessManClick(rowIndex: number, colIndex: number, chessMan?: ChessMan | null){
    if (this.clickedChessMan){
      if (this.isValidNextPosition(colIndex, rowIndex)) {
        this.gameEngine.move(this.clickedChessMan.colIndex, this.clickedChessMan.rowIndex, colIndex, rowIndex);
        this.clickedChessMan = undefined;
        this.nextPositionHints = [];
      } else if (chessMan){
        this.clickedChessMan = undefined;
        this.chessManClick(rowIndex, colIndex, chessMan);
      }
    }else{
      if (chessMan){
        this.clickedChessMan = {rowIndex , colIndex, chessMan};
        this.nextPositionHints = this.gameEngine.ableNextPosition(colIndex, rowIndex);
      }
    }
  }

  isValidNextPosition(x: number, y: number): boolean {
    return this.nextPositionHints.some(it => isEqual(it, {x, y}))
  }
}
