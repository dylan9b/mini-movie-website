import { CurrencyPipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { MovieStore } from '@store/movie.store';
import { combineLatest, filter, map } from 'rxjs';
import { MovieResponse } from '../_model/movie-response.model';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss',
  imports: [MatChipsModule, DecimalPipe, CurrencyPipe],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailComponent implements OnInit {
  private readonly _store = inject(MovieStore);
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _movies$ = toObservable(this._store.movies);

  protected readonly movieDetailSignal = signal<MovieResponse | null>(null);

  protected isImageLoaded = false;
  protected isImageBroken = false;

  ngOnInit(): void {
    this.subscribeRouteParams();
  }

  private subscribeRouteParams(): void {
    // since store and routeParams have different timings, we need to react to any
    // new emissions from each observable at least once and return the latest value
    // for each
    combineLatest([
      this._route.paramMap.pipe(
        map((params) => params.get('slug')),
        filter((slug): slug is string => !!slug),
      ),
      this._movies$,
    ])
      .pipe(
        map(([slug, movies]) => movies?.[slug]),
        filter((movie): movie is MovieResponse => !!movie),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((movie) => {
        this.movieDetailSignal.set(movie);
      });
  }
}
