import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { MovieResponse } from '@pages/movies/_model/movie-response.model';
import { catchError, EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly _http = inject(HttpClient);

  getAll$(): Observable<MovieResponse[]> {
    return this._http
      .get<MovieResponse[]>(environment.url)
      .pipe(catchError(() => EMPTY));
  }
}
