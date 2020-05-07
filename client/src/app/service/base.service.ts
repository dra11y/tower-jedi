import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { formatDate } from "@angular/common";

import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  // httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  // };

  constructor(
    protected http: HttpClient
  ) { }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a message to the console */
  protected log(message: string) {
    let now = formatDate(new Date(), 'MM/dd/yyyy HH:mm:ss', 'en-US');
    console.log(`${now} ${this.constructor.name}: ${message}`);
  }
}
