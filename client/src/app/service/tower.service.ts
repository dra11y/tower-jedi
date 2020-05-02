import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { BaseService } from './base.service';

import { Tower } from '../model/tower';

@Injectable({
  providedIn: 'root'
})
export class TowerService extends BaseService {

  private towersUrl = '/api/exhaust_port/towers';  // URL to web api

  /** DELETE: destroys the tower from the server */
  destroyTower(tower: Tower | number): Observable<Tower> {
    const id = typeof tower === 'number' ? tower : tower.id;
    const url = `${this.towersUrl}/${id}`;
    this.log(url);

    return this.http.delete<Tower>(url).pipe(
      tap(_ => this.log(`destroyed tower id=${id}`)),
      catchError(this.handleError<Tower>('destroyTower'))
    );
  }

  /** GET towers from the server */
  getTowers(): Observable<Tower[]> {
    this.log('getting Towers');
    return this.http.get<Tower[]>(this.towersUrl)
      .pipe(
        tap(t => this.log(`fetched ${t.length} Towers!`)),
        catchError(this.handleError<Tower[]>('getTowers', []))
      );
  }
}
