import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardComponent } from './game-board/game-board.component';



@NgModule({
    declarations: [
        GameBoardComponent
    ],
    exports: [
        GameBoardComponent
    ],
    imports: [
        CommonModule
    ]
})
export class PagesModule { }
