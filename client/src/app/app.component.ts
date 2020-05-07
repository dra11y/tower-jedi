import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { TowerService } from './service/tower.service';
import { XWingService } from './service/xwing.service';
import { Tower } from './model/tower';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'client';
  towers: Tower[];
  graph$: any;

  onChartClick(e) {
    this.graph$.subscribe(graph => {
      console.log(graph);
    });

    let name: string = e.points[0].data.name;

    if (typeof name === 'undefined' || name != 'Tower') return;

    let id: number = e.points[0].id;

    // this.towerService.destroyTower(id)
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
    this.loadGraph();
  }

  loadGraph() {
    this.graph$ = forkJoin(
      this.towerService.getTowers(),
      this.xWingService.getXWings()
    ).pipe(
      map(([towers, xwings]) => {
        // associate each tower with its target XWing object
        towers.map(t => {
          t.target_xwing = xwings.find(
            xw => xw.id == t.target
          )
        });

        let data: any[] = [
          // plot Towers
          {
            name: 'Tower',
            ids: towers.map(t => t.id),
            x: towers.map(t => t.coordinates.x),
            y: towers.map(t => t.coordinates.y),
            z: towers.map(t => t.coordinates.z),
            text: towers.map(t => `Tower: ${t.id}<br>sec: ${t.sector}<br>h: ${t.health}<br>target: ${t.target_xwing.name}`),
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

        return {
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
        };
      }));
  }

  constructor(
    private towerService: TowerService,
    private xWingService: XWingService,
  ) { }

}
