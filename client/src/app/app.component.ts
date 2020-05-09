import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Tower } from './models/tower';
import { map } from 'rxjs/operators';

import { Select, Store } from '@ngxs/store';
import { FireAtTower, GetTowers } from './actions/tower.actions';
import { GameStateModel, GameState } from './states/game.state';
import { GetXWings } from './actions/xwing.actions';
import { Observable } from 'rxjs';
import { UpdateChart, UpdateCamera } from './actions/chart.actions';

import { debounce } from 'lodash';
import { ResetGame, InitGame } from './actions/game.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    constructor(private store: Store) {
        this.click = debounce(this.click, 300);
    }

    @Select(GameState.getGameState) game$: Observable<GameStateModel>;
    @Select(GameState.getChart) chart$: Observable<GameStateModel>;

    relayout(e) {
        console.log(e);
        this.store.dispatch(new UpdateCamera(e["scene.camera"]));
    }

    click(e) {
        let name: string = e.points[0].data.name;
        if (typeof name === 'undefined' || name != 'Tower') return;
        let id: number = e.points[0].id;
        this.store.dispatch(new FireAtTower(id));
        console.log(`${this.constructor.name}: Chart clicked on ${name} ${id}`);
    }

    resetGame() {
        this.store.dispatch(new ResetGame());
    }

    ngOnInit() {
        let finale = new Audio();
        finale.src = "../assets/finale.mp3";
        finale.load();

        this.store.dispatch(new InitGame());
    }

}
