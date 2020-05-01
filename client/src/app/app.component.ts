import { Component } from '@angular/core';
import { TowerService } from './service/tower.service';
import { XWingService } from './service/xwing.service';
import { MessageService } from './service/message.service';
import { Tower } from './model/tower';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'client';
  towers: Tower[];

  onChartClick(e) {
    let obj: any = e.points[0].data;
    this.messageService.add(`${this.constructor.name}: Chart clicked on ${obj.name}`);
  }

  graph$ = forkJoin(
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
          mode: 'markers+text',
          marker: {
            symbol: 'square-open',
            size: towers.map(t => t.health),
            color: '#080',
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
          mode: 'markers+text',
          marker: {
            symbol: 'x',
            size: xwings.map(xw => xw.health / 4),
            color: '#f00',
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
            showlegend: false,
            line: {
              color: '#00f',
              width: 2
            }
          });
        }
      });

      return {
        data: data,
        layout: {
          margin: { l: 0, r: 0, b: 0, t: 0 }
        }
      };
    }));

  constructor(
    private towerService: TowerService,
    private xWingService: XWingService,
    private messageService: MessageService
  ) { }

}
