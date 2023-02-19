import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardComponent } from './game-board/game-board.component';
import {FormsModule} from "@angular/forms";



@NgModule({
    declarations: [
        GameBoardComponent
    ],
    exports: [
        GameBoardComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ]
})
export class PagesModule { }
