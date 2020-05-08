import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { BaseService } from './base.service';

import { XWing } from '../models/xwing';

@Injectable({
  providedIn: 'root'
})
export class XWingsService extends BaseService {

  private xWingsUrl = '/api/exhaust_port/xwings';  // URL to web api

  /** GET XWings from the server */
  getXWings(): Observable<XWing[]> {
    this.log('getting XWings');
    return this.http.get<XWing[]>(this.xWingsUrl)
      .pipe(
        tap(xw => this.log(`fetched ${xw.length} XWings!`)),
        catchError(this.handleError<XWing[]>('getXWings', []))
      );
  }
}
