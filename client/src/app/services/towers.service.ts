import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { BaseService } from './base.service';

import { Tower } from '../models/tower';

@Injectable({
  providedIn: 'root'
})
export class TowersService extends BaseService {

  private towersUrl = '/api/exhaust_port/towers';  // URL to web api

  /** DELETE: shoot (attempt to destroy) a tower */
  shootTower(tower: Tower): Observable<Tower> {
    const url = `${this.towersUrl}/${tower.id}`;
    this.log(url);
    return this.http.delete<Tower>(url).pipe(
      tap(r => { this.log(`shot tower id=${tower.id}`); }),
      catchError(this.handleError<Tower>('shootTower'))
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
