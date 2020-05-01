import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { BaseService } from './base.service';

import { Tower } from '../model/tower';

@Injectable({
  providedIn: 'root'
})
export class TowerService extends BaseService {

  private towersUrl = '/exhaust_port/towers';  // URL to web api

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
