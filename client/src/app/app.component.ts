import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { debounce } from 'lodash';
import { Observable } from 'rxjs';
import { UpdateCamera } from './actions/chart.actions';
import { NewGame } from './actions/game.actions';
import { FireAtTower } from './actions/tower.actions';
import { GameState, GameStateModel } from './states/game.state';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    @Select(GameState.getGameState) game$: Observable<GameStateModel>;
    @Select(GameState.getChart) chart$: Observable<GameStateModel>;
    welcome: boolean = true;

    constructor(private store: Store) {
        this.click = debounce(this.click, 300);
    }

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

    newGame(count: number) {
        this.store.dispatch(new NewGame(count));
        this.welcome = false;
    }

    ngOnInit() {
        let finale = new Audio();
        finale.src = "../assets/finale.mp3";
        finale.load();

        let intro = new Audio();
        intro.src = "../assets/intro.mp3";
        intro.load();
    }
}
