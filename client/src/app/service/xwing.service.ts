import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { BaseService } from './base.service';

import { XWing } from '../model/xwing';

@Injectable({
  providedIn: 'root'
})
export class XWingService extends BaseService {

  private xWingsUrl = '/exhaust_port/xwings';  // URL to web api

  /** GET towers from the server */
  getXWings(): Observable<XWing[]> {
    this.log('getting XWings');
    return this.http.get<XWing[]>(this.xWingsUrl)
      .pipe(
        tap(xw => this.log(`fetched ${xw.length} XWings!`)),
        catchError(this.handleError<XWing[]>('getXWings', []))
      );
  }

}
