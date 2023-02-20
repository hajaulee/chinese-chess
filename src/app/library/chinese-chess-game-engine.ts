import {GameTurn} from "./game-turn";
import {GameEngine, GameMove} from "./game-engine";

export interface ChessManPosition {
  x: number,
  y: number
}

export interface ChessMove extends GameMove {
  from: ChessManPosition;
  to: ChessManPosition;
}


export const TOT_VALUE = 10
export const PHAO_VALUE = 80
export const XE_VALUE = 90
export const MA_VALUE = 60
export const TINH_VALUE = 20
export const SI_VALUE = 40
export const TUONG_VALUE = 999

export type ChessManCode = 'tot' | 'phao' | 'xe' | 'ma' | 'tinh' | 'si' | 'tuong';
export const ChessManCode = {
  tot: 'tot' as ChessManCode,
  phao: 'phao' as ChessManCode,
  xe: 'xe' as ChessManCode,
  ma: 'ma' as ChessManCode,
  tinh: 'tinh' as ChessManCode,
  si: 'si' as ChessManCode,
  tuong: 'tuong' as ChessManCode
}

export interface ChessMan {
  code: ChessManCode,
  value: number,
  label: string,
  color: GameTurn
}

export const ChessMan: { [k: string]: ChessMan } = {
  redTot: {
    code: ChessManCode.tot,
    value: TOT_VALUE,
    label: '兵',
    color: GameTurn.RED
  },
  redPhao: {
    code: ChessManCode.phao,
    value: PHAO_VALUE,
    label: '炮',
    color: GameTurn.RED
  },
  redXe: {
    code: ChessManCode.xe,
    value: XE_VALUE,
    label: '車',
    color: GameTurn.RED
  },
  redMa: {
    code: ChessManCode.ma,
    value: MA_VALUE,
    label: '馬',
    color: GameTurn.RED
  },
  redTinh: {
    code: ChessManCode.tinh,
    value: TINH_VALUE,
    label: '相',
    color: GameTurn.RED
  },
  redSi: {
    code: ChessManCode.si,
    value: SI_VALUE,
    label: '仕',
    color: GameTurn.RED
  },
  redTuong: {
    code: ChessManCode.tuong,
    value: TUONG_VALUE,
    label: '師',
    color: GameTurn.RED
  },
  blackTot: {
    code: ChessManCode.tot,
    value: -TOT_VALUE,
    label: '卒',
    color: GameTurn.BLACK
  },
  blackPhao: {
    code: ChessManCode.phao,
    value: -PHAO_VALUE,
    label: '砲',
    color: GameTurn.BLACK
  },
  blackXe: {
    code: ChessManCode.xe,
    value: -XE_VALUE,
    label: '車',
    color: GameTurn.BLACK
  },
  blackMa: {
    code: ChessManCode.ma,
    value: -MA_VALUE,
    label: '馬',
    color: GameTurn.BLACK
  },
  blackTinh: {
    code: ChessManCode.tinh,
    value: -TINH_VALUE,
    label: '象',
    color: GameTurn.BLACK
  },
  blackSi: {
    code: ChessManCode.si,
    value: -SI_VALUE,
    label: '士',
    color: GameTurn.BLACK
  },
  blackTuong: {
    code: ChessManCode.tuong,
    value: -TUONG_VALUE,
    label: '將',
    color: GameTurn.BLACK
  },
}

export const redTot = ChessMan.redTot;
export const redPhao = ChessMan.redPhao;
export const redXe = ChessMan.redXe;
export const redMa = ChessMan.redMa;
export const redTinh = ChessMan.redTinh;
export const redSi = ChessMan.redSi;
export const redTuong = ChessMan.redTuong;
export const blackTot = ChessMan.blackTot;
export const blackPhao = ChessMan.blackPhao;
export const blackXe = ChessMan.blackXe;
export const blackMa = ChessMan.blackMa;
export const blackTinh = ChessMan.blackTinh;
export const blackSi = ChessMan.blackSi;
export const blackTuong = ChessMan.blackTuong;

export class ChineseChessGameEngine implements GameEngine {

  // Constants
  maxX = 8;
  maxY = 9;

  board: Array<Array<ChessMan | null>> = [
    [blackXe, blackMa, blackTinh, blackSi, blackTuong, blackSi, blackTinh, blackMa, blackXe],
    [null, null, null, null, null, null, null, null, null],
    [null, blackPhao, null, null, null, null, null, blackPhao, null],
    [blackTot, null, blackTot, null, blackTot, null, blackTot, null, blackTot],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [redTot, null, redTot, null, redTot, null, redTot, null, redTot],
    [null, redPhao, null, null, null, null, null, redPhao, null],
    [null, null, null, null, null, null, null, null, null],
    [redXe, redMa, redTinh, redSi, redTuong, redSi, redTinh, redMa, redXe],
  ];
  boardHistory: Array<Array<Array<ChessMan | null>>> = [];
  gameTurn: GameTurn = GameTurn.RED

  constructor(private firstTurn: GameTurn = GameTurn.RED, private saveHistory = true) {
    this.gameTurn = firstTurn;
  }

  move(gameMove: ChessMove) {
    if (this.gameTurn == GameTurn.RED && this.saveHistory){
      this.boardHistory.push(this.board.map(row => [...row]));
    }
    this.board[gameMove.to.y][gameMove.to.x] = this.board[gameMove.from.y][gameMove.from.x];
    this.board[gameMove.from.y][gameMove.from.x] = null;
    this.changeTurn();
  }

  undo(){
    if (this.boardHistory.length > 0) {
      this.board = this.boardHistory[this.boardHistory.length - 1];
      this.boardHistory.length -= 1;
    }
  }

  changeTurn() {
    if (this.gameTurn == GameTurn.RED) {
      this.gameTurn = GameTurn.BLACK;
    } else {
      this.gameTurn = GameTurn.RED
    }
  }

  ableMoves(): Array<ChessMove> {
    const moves = [];
    for (let y = 0; y <= this.maxY; y++){
      for (let x = 0; x <= this.maxX; x++){
        if (this.board[y][x]?.color == this.gameTurn){
          moves.push(...this.ableNextPositions(x, y).map(position => ({
            from: {x, y},
            to: position
          })))
        }
      }
    }
    return moves;
  }

  ableNextPositions(x: number, y: number): Array<ChessManPosition> {
    const posFunc: { [k: string]: (x: number, y: number) => Array<ChessManPosition> } = {
      tot: this.ableNextPosOfTot.bind(this),
      phao: this.ableNextPosOfPhao.bind(this),
      xe: this.ableNextPosOfXe.bind(this),
      ma: this.ableNextPosOfMa.bind(this),
      tinh: this.ableNextPosOfTinh.bind(this),
      si: this.ableNextPosOfSi.bind(this),
      tuong: this.ableNextPosOfTuong.bind(this)
    }
    const chessMan = this.getChessMan({x, y});
    return chessMan ? posFunc[chessMan.code](x, y) : [];
  }

  ableNextPosOfTot(x: number, y: number): Array<ChessManPosition> {
    const positions: Array<ChessManPosition> = [];
    const chessMan = this.getChessMan({x, y})!;

    const aHeadPos = this.isRed(chessMan) ? {x, y: y - 1} : {x, y: y + 1};
    this.addValidPos(positions, chessMan, aHeadPos);
    if (this.isOverRiver(chessMan, {x, y})) {
      const leftPos = {x: x - 1, y};
      const rightPos = {x: x + 1, y};
      this.addValidPos(positions, chessMan, leftPos)
      this.addValidPos(positions, chessMan, rightPos)
    }
    return positions;
  }

  ableNextPosOfPhao(x: number, y: number): Array<ChessManPosition> {
    const positions: Array<ChessManPosition> = [];
    const chessMan = this.getChessMan({x, y})!;
    ['up', 'down', 'left', 'right'].forEach(direct => {
      let newX = x;
      let newY = y;
      let shotted = false;
      while(true){
        direct == 'up' ? newY-- : direct == 'down' ? newY++ : direct == 'left' ? newX-- : newX++;
        if (!(newX >= 0 && newX <= this.maxX && newY >= 0 && newY <= this.maxY)){
          break;
        }
        const newPos = {x: newX, y: newY};
        const obstruction = this.getChessMan(newPos);
        if (obstruction == null){
          if (!shotted) {
            positions.push(newPos);
          }
        } else {
          if (!shotted){
            shotted = true;
          } else {
            if (!this.isSameColor(chessMan, obstruction)) {
              positions.push(newPos);
            }
            break;
          }
        }
      }
    })
    return positions;
  }

  ableNextPosOfXe(x: number, y: number): Array<ChessManPosition> {
    const positions: Array<ChessManPosition> = [];
    const chessMan = this.getChessMan({x, y})!;
    ['up', 'down', 'left', 'right'].forEach(direct => {
      let newX = x;
      let newY = y;
      while(true){
        direct == 'up' ? newY-- : direct == 'down' ? newY++ : direct == 'left' ? newX-- : newX++;
        if (!(newX >= 0 && newX <= this.maxX && newY >= 0 && newY <= this.maxY)){
          break;
        }
        const newPos = {x: newX, y: newY};
        const obstruction = this.getChessMan(newPos);
        if (obstruction == null){
          positions.push(newPos);
        } else if (!this.isSameColor(chessMan, obstruction)){
          positions.push(newPos);
          break;
        } else {
          break;
        }
      }
    })
    return positions
  }

  ableNextPosOfMa(x: number, y: number): Array<ChessManPosition> {
    const positions: Array<ChessManPosition> = [];
    const chessMan = this.getChessMan({x, y})!;
    const jumblePositions = [];
    if (!this.getChessMan({x, y: y + 1})) {
      jumblePositions.push({x: x - 1, y: y + 2}, {x: x + 1, y: y + 2},)
    }
    if (!this.getChessMan({x, y: y - 1})) {
      jumblePositions.push({x: x - 1, y: y - 2}, {x: x + 1, y: y - 2},)
    }
    if (!this.getChessMan({x: x + 1, y})) {
      jumblePositions.push({x: x + 2, y: y + 1}, {x: x + 2, y: y - 1},)
    }
    if (!this.getChessMan({x: x - 1, y})) {
      jumblePositions.push({x: x - 2, y: y + 1}, {x: x - 2, y: y - 1},)
    }
    jumblePositions.forEach((pos) => this.addValidPos(positions, chessMan, pos));
    return positions
  }

  ableNextPosOfTinh(x: number, y: number): Array<ChessManPosition> {
    const positions: Array<ChessManPosition> = [];
    const chessMan = this.getChessMan({x, y})!;
    const leftUpPos = {x: x - 2, y: y + 2}
    const leftDownPos = {x: x - 2, y: y - 2}
    const rightUpPos = {x: x + 2, y: y + 2}
    const rightDownPos = {x: x + 2, y: y - 2};
    this.addValidPos(positions, chessMan, leftUpPos);
    this.addValidPos(positions, chessMan, leftDownPos);
    this.addValidPos(positions, chessMan, rightUpPos);
    this.addValidPos(positions, chessMan, rightDownPos);
    return positions
  }

  ableNextPosOfSi(x: number, y: number): Array<ChessManPosition> {
    const positions: Array<ChessManPosition> = [];
    const chessMan = this.getChessMan({x, y})!;
    const leftUpPos = {x: x - 1, y: y + 1}
    const leftDownPos = {x: x - 1, y: y - 1}
    const rightUpPos = {x: x + 1, y: y + 1}
    const rightDownPos = {x: x + 1, y: y - 1};
    this.addValidPos(positions, chessMan, leftUpPos);
    this.addValidPos(positions, chessMan, leftDownPos);
    this.addValidPos(positions, chessMan, rightUpPos);
    this.addValidPos(positions, chessMan, rightDownPos);
    return positions
  }

  ableNextPosOfTuong(x: number, y: number): Array<ChessManPosition> {
    const positions: Array<ChessManPosition> = [];
    const chessMan = this.getChessMan({x, y})!;
    const leftPos = {x: x + 1, y}
    const rightPos = {x: x - 1, y}
    const upPos = {x, y: y - 1};
    const downPos = {x, y: y + 1};
    this.addValidPos(positions, chessMan, leftPos);
    this.addValidPos(positions, chessMan, rightPos);
    this.addValidPos(positions, chessMan, upPos);
    this.addValidPos(positions, chessMan, downPos);
    const tuongLine = this.board.map(row => row[x]);
    if (tuongLine.filter(cell => !!cell).length == 2){
      const otherTuongIdx = tuongLine.findIndex((cell, index) => cell?.code == ChessManCode.tuong && index != y);
      if (otherTuongIdx != -1){
        positions.push({x, y: otherTuongIdx});
      }
    }
    return positions
  }

  getChessMan(position: ChessManPosition): ChessMan | null {
    return this.board[position.y]?.[position.x];
  }

  isOverRiver(chessMan: ChessMan, position: ChessManPosition): boolean {
    return this.isRed(chessMan) && position.y < 5 || this.isBlack(chessMan) && position.y > 4
  }

  isRed(chessMan?: ChessMan): boolean {
    return chessMan?.color == GameTurn.RED
  }

  isBlack(chessMan?: ChessMan): boolean {
    return chessMan?.color == GameTurn.BLACK
  }

  addValidPos(positions: Array<ChessManPosition>, chessMan: ChessMan, newPosition: ChessManPosition): Array<ChessManPosition> {
    if (this.isValidNewPos(chessMan, newPosition)) {
      positions.push(newPosition)
    }
    return positions
  }

  isSameColor(chessMan1?: ChessMan | null, chessMan2?: ChessMan | null): boolean {
    if (!chessMan1 || !chessMan2) {
      return false;
    }
    return chessMan1.color == chessMan2.color
  }

  isValidNewPos(chessMan: ChessMan, newPosition: ChessManPosition): boolean {
    let [minX, minY, maxX, maxY] = [0, 0, this.maxX, this.maxY];
    if ([ChessManCode.si, ChessManCode.tuong].includes(chessMan.code)) {
      [minX, maxX] = [3, 5];
      if (this.isRed(chessMan)) {
        minY = 7;
      }
      if (this.isBlack(chessMan)) {
        maxY = 2;
      }
    }
    if ([ChessManCode.tinh].includes(chessMan.code)) {
      if (this.isRed(chessMan)) {
        minY = 5;
      }
      if (this.isBlack(chessMan)) {
        maxY = 4;
      }
    }
    return newPosition.x >= minX && newPosition.x <= maxX &&
      newPosition.y >= minY && newPosition.y <= maxY &&
      !this.isSameColor(chessMan, this.getChessMan(newPosition));
  }

  clone(): GameEngine {
    const game = new ChineseChessGameEngine(this.firstTurn, false);
    game.board = this.board.map(row => row.slice());
    game.gameTurn = this.gameTurn;
    return game;
  }
}
