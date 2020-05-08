import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { Tower } from '../models/tower';
import { GetTowers, FireAtTower } from '../actions/tower.actions';
import { UpdateChart } from '../actions/chart.actions';
import { GetXWings } from '../actions/xwing.actions';
import { TowersService } from '../services/towers.service';
import { tap } from 'rxjs/operators';
import { XWing } from '../models/xwing';
import { XWingsService } from '../services/xwings.service';

export interface GameStateModel {
    towers: Tower[];
    xwings: XWing[];
    chart: any;
}

@State<GameStateModel>({
    name: 'game',
    defaults: {
        towers: [],
        xwings: [],
        chart: null
    }
})
@Injectable()
export class GameState {
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
    getTowers({ getState, patchState }: StateContext<GameStateModel>) {
        return this.towersService.getTowers().pipe(tap((result) => {
            const xwings: XWing[] = getState().xwings;
            patchState({
                towers: result.map(t => {
                    t.target_xwing = xwings.find(
                        xw => xw.id == t.target
                    )
                    return t;
                })
            });
        }));
    }

    @Action(FireAtTower)
    fireAtTower({ getState, patchState, dispatch }: StateContext<GameStateModel>, { id }: FireAtTower) {
        let tower: Tower = getState().towers.find(t => t.id == id);
        tower.health -= 50;
        return this.towersService.updateTower(tower).pipe(tap((result) => {
            const xwings: XWing[] = getState().xwings;
            patchState({
                towers: getState().towers.map(t => {
                    if (t.id == id) t = result;
                    t.target_xwing = xwings.find(
                        xw => xw.id == t.target
                    )
                    return t;
                })
            });
            dispatch(new UpdateChart());
        }));
    };

    @Action(GetXWings)
    getXWings({ patchState, dispatch }: StateContext<GameStateModel>) {
        return this.xWingsService.getXWings().pipe(tap((result) => {
            patchState({ xwings: result });
        }));
    }

    @Action(UpdateChart)
    updateChart({ getState, patchState }: StateContext<GameStateModel>) {

        let towers: Tower[] = getState().towers;
        let xwings: XWing[] = getState().xwings;

        let data: any[] = [
            // plot Towers
            {
                name: 'Tower',
                ids: towers.map(t => t.id),
                x: towers.map(t => t.coordinates.x),
                y: towers.map(t => t.coordinates.y),
                z: towers.map(t => t.coordinates.z),
                // text: towers.map(t => `Tower: ${t.id}<br>sec: ${t.sector}<br>h: ${t.health}<br>target: ${t.target_xwing.name}`),
                type: 'scatter3d',
                mode: 'markers',
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
                text: xwings.map(xw => `XWing: ${xw.name}<br>plt: ${xw.pilot.first_name}<br>h: ${xw.health}`),
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
            if (typeof t.target_xwing !== 'undefined') {
                data.push({
                    x: [t.coordinates.x, t.target_xwing.coordinates.x],
                    y: [t.coordinates.y, t.target_xwing.coordinates.y],
                    z: [t.coordinates.z, t.target_xwing.coordinates.z],
                    type: 'scatter3d',
                    mode: 'lines',
                    name: 'Target Line',
                    showlegend: false,
                    line: {
                        color: '#0af',
                        width: 2
                    }
                });
            }
        });

        patchState({
            chart: {
                data: data,
                layout: {
                    autosize: true,
                    xaxis: {
                        range: [-10, 10]
                    },
                    yaxis: {
                        range: [-10, 10]
                    },
                    zaxis: {
                        range: [-10, 10]
                    },
                    height: 400,
                    margin: { l: 0, r: 0, b: 0, t: 0 },
                    paper_bgcolor: '#fff',
                    showlegend: true,
                    legend: {
                        x: 1,
                        y: 0.5,
                        xanchor: 'right',
                        yanchor: 'top',
                    }
                }
            }
        });

    }
}
