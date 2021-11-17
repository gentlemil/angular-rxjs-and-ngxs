import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { Country } from './country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  public endpoint: string = "https://restcountries.eu/rest/v2/name/";
  
  constructor(private http: HttpClient) { }

  public searchCountry(term: string): Observable<Country[]> {
    const url = `${this.endpoint}${term}`;
    if (!term.trim()) { // usuwa biale spacje
      console.log(of([]));
      return of([]) // zwraca tablice 
    }
    return this.http.get<Country[]>(url).pipe(
      catchError(this.handleError<Country[]>('countries', []))
    )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`failed: ${error.message}`);
      return of(result as T);
    };
  }
}


