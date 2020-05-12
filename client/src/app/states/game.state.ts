import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Tower } from '../models/tower';
import { GetTowers, FireAtTower } from '../actions/tower.actions';
import { UpdateChart, UpdateCamera } from '../actions/chart.actions';
import { GetXWings } from '../actions/xwing.actions';
import { TowersService } from '../services/towers.service';
import { tap } from 'rxjs/operators';
import { XWing } from '../models/xwing';
import { XWingsService } from '../services/xwings.service';
import { CheckIfWon, NewGame, InitGame } from '../actions/game.actions';

export interface GameStateModel {
    towers: Tower[];
    xwings: XWing[];
    chart: any;
    camera: any;
}

@State<GameStateModel>({
    name: 'game',
    defaults: {
        towers: [],
        xwings: [],
        chart: null,
        camera: null
    }
})
@Injectable()
export class GameState {
    promise: Promise<unknown>;
    speech: any = (<any>window).speechSynthesis;

    constructor(
        private towersService: TowersService,
        private xWingsService: XWingsService
    ) { }

    @Selector()
    static getTowers(state: GameStateModel) {
        return state.towers;
    }

    @Selector()
    static getXWings(state: GameStateModel) {
        return state.xwings;
    }

    @Selector()
    static getChart(state: GameStateModel) {
        return state.chart;
    }

    @Selector()
    static getGameState(state: GameStateModel) {
        return state;
    }

    @Action(GetTowers)
    getTowers({ patchState }: StateContext<GameStateModel>) {
        return this.towersService.getTowers().pipe(tap((result) => {
            patchState({ towers: result });
        }));
    }

    play(name: string) {
        return new Promise((resolve, reject) => {
            if (name == null) {
                resolve;
                return;
            }
            let audio = new Audio();
            audio.autoplay = true;
            audio.onerror = reject;
            audio.onended = resolve;
            audio.src = "../assets/" + name + ".mp3";
            audio.play();
        });
    }

    speak(text: string) {
        return new Promise((resolve, reject) => {
            if (text == null) {
                resolve;
                return;
            }
            this.speech.cancel();
            let tts = new SpeechSynthesisUtterance(text);
            tts.volume = 1.0;
            tts.rate = 1.5;
            tts.onend = resolve;
            tts.onerror = reject;
            this.speech.speak(tts);
        });
    }

    @Action(NewGame)
    newGame({ dispatch }: StateContext<GameStateModel>, { count }: NewGame) {
        return this.towersService.resetGame(count).pipe(tap((result) => {
            return dispatch(new InitGame());
        }));
    }

    @Action(InitGame)
    initGame({ dispatch }: StateContext<GameStateModel>) {
        dispatch([
            new GetTowers(),
            new GetXWings()
        ]).subscribe(() => {
            // this.play("intro");
            dispatch(new UpdateChart());
        });
    }

    @Action(FireAtTower)
    fireAtTower({ getState, patchState, dispatch }: StateContext<GameStateModel>, { id }: FireAtTower) {
        let tower: Tower = getState().towers.find(t => t.id == id);
        this.promise = Promise.resolve();
        let times = 1 + Math.ceil(4 * Math.random());
        for (let i = 0; i < times; i ++) {
            setTimeout(() => {
                this.promise = this.play("fire1");
            }, 100 * i);
        }
        return this.towersService.shootTower(tower).pipe(tap((result) => {
            const xwings: XWing[] = getState().xwings;
            console.log('RESULT:');
            console.log(result);
            if (result.is_destroyed) {
                let number = Math.ceil(6 * Math.random());
                this.promise = this.promise.then(() => this.play("ex" + number.toString()));
            }
            patchState({
                towers: getState().towers.map(t => {
                    if (t.id == id) t = result;
                    return t;
                })
            });
            dispatch([
                new UpdateChart(),
                new CheckIfWon()
            ]);
        }));
    };

    @Action(GetXWings)
    getXWings({ patchState, dispatch }: StateContext<GameStateModel>) {
        return this.xWingsService.getXWings().pipe(tap((result) => {
            patchState({ xwings: result });
        }));
    }

    @Action(CheckIfWon)
    checkIfWon({ getState }: StateContext<GameStateModel>) {
        console.log("CHECK IF WON")
        let towers: Tower[] = getState().towers;
        if (0 == towers.filter(t => t.is_destroyed == false).length) {
            console.log("WON!!!");
            if (navigator.userAgent.toLowerCase().indexOf('safari/') > -1) {
                // BUG: speech "onend" event not fired in Safari for some reason
                this.promise
                    .then(_ => {
                        this.speak("Congratulations, you have won!");
                        let that = this;
                        setTimeout(() => {
                            that.play("finale");
                        }, 1800);
                    });
            } else {
                // ... but it's OK in Firefox/Chrome
                this.promise
                    .then(_ => this.speak("Congratulations, you have won!"))
                    .then(_ => this.play("finale"));
            }
        }
    }

    @Action(UpdateCamera)
    updateCamera({ getState, patchState }: StateContext<GameStateModel>, { camera }: UpdateCamera) {
        patchState({ camera: camera });
    }

    @Action(UpdateChart)
    updateChart({ getState, patchState }: StateContext<GameStateModel>) {

        let towers: Tower[] = getState().towers;
        let xwings: XWing[] = getState().xwings;
        let camera: any = getState().camera;

        let data: any[] = [
            // plot Towers
            {
                name: 'Tower',
                ids: towers.map(t => t.id),
                x: towers.map(t => t.coordinates.x),
                y: towers.map(t => t.coordinates.y),
                z: towers.map(t => t.coordinates.z),
                text: towers.map(t => `Tower: ${t.id}<br>sector: ${t.sector}<br>health: ${t.health}<br>target: ${t.target.name}`),
                type: 'scatter3d',
                mode: 'markers',
                hoverinfo: 'text',
                marker: {
                    symbol: 'square-open',
                    size: towers.map(t => t.health),
                    color: '#0f0',
                    line: {
                        width: 0
                    }
                }
            },

            // plot XWings
            {
                name: 'XWing',
                ids: xwings.map(xw => xw.id),
                x: xwings.map(xw => xw.coordinates.x),
                y: xwings.map(xw => xw.coordinates.y),
                z: xwings.map(xw => xw.coordinates.z),
                text: xwings.map(xw => `XWing: ${xw.name}<br>pilot: ${xw.pilot.first_name} ${xw.pilot.last_name}<br>health: ${xw.health}`),
                hoverinfo: 'text',
                type: 'scatter3d',
                mode: 'markers',
                marker: {
                    symbol: 'x',
                    size: xwings.map(xw => xw.health / 4),
                    color: '#f00',
                    line: {
                        width: 0
                    }
                }
            }
        ];

        towers.map(t => {
            if (t.is_destroyed) return;
            data.push({
                x: [t.coordinates.x, t.target.coordinates.x],
                y: [t.coordinates.y, t.target.coordinates.y],
                z: [t.coordinates.z, t.target.coordinates.z],
                type: 'scatter3d',
                mode: 'lines',
                name: 'Target Line',
                showlegend: false,
                hoverinfo: 'none',
                line: {
                    color: '#0af',
                    width: 2
                }
            });
        });

        patchState({
            chart: {
                data: data,
                layout: {
                    clickmode: "select+event",
                    hovermode: "closest",
                    scene: {
                        camera: camera
                    },
                    xaxis: {
                        range: [-10, 10]
                    },
                    yaxis: {
                        range: [-10, 10]
                    },
                    zaxis: {
                        range: [-10, 10]
                    },
                    autosize: true,
                    margin: { l: 0, r: 0, b: 0, t: 0 },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    showlegend: true,
                    legend: {
                        x: 1,
                        y: 0.5,
                        xanchor: 'right',
                        yanchor: 'top',
                    }
                },
                config: {
                    doubleClickDelay: 500,
                    displayModeBar: true
                }
            }
        });

    }
}
