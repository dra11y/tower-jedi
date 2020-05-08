import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Tower } from './models/tower';
import { map } from 'rxjs/operators';

import { Select, Store } from '@ngxs/store';
import { FireAtTower, GetTowers } from './actions/tower.actions';
import { GameStateModel, GameState } from './states/game.state';
import { GetXWings } from './actions/xwing.actions';
import { Observable } from 'rxjs';
import { UpdateChart } from './actions/chart.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    constructor(private store: Store) { }

    @Select(GameState.getGameState) game$: Observable<GameStateModel>;
    @Select(GameState.getChart) chart$: Observable<GameStateModel>;

    onChartClick(e) {
        let name: string = e.points[0].data.name;

        if (typeof name === 'undefined' || name != 'Tower') return;

        let id: number = e.points[0].id;

        this.store.dispatch(new FireAtTower(id));

        // this.TowersService.destroyTower(id)
        //   .subscribe(tower => {
        //     console.log(tower);
        //   });
        //
        // this.play("fire").then(() => {
        //   this.play("explode");
        //   this.loadGraph();
        // });

        console.log(`${this.constructor.name}: Chart clicked on ${name} ${id}`);
    }

    play(name: string) {
        return new Promise((resolve, reject) => {   // return a promise
            let audio = new Audio();
            audio.onerror = reject;
            audio.onended = resolve;
            audio.src = "../assets/" + name + ".mp3";
            audio.play();
        });
    }

    ngOnInit() {
        this.store.dispatch([
            new GetTowers(),
            new GetXWings()
        ]).subscribe(() => {
            this.store.dispatch(new UpdateChart());
        });

        this.game$.subscribe((game: GameStateModel) => {
            console.log("GAME STATE CHANGED!");

        })
    }

}
