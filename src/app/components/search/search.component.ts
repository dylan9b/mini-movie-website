import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MovieStore } from '@store/movie.store';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  switchMap,
  tap,
} from 'rxjs';
@Component({
  selector: 'app-search',
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private readonly _store = inject(MovieStore);
  private readonly _loadDelaySignal = this._store.config.loadDelay;
  private readonly _searchInputSignal =
    viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
  // this can also be re-written as readonly #searchInput$, where # means that this is a private variable
  private readonly _searchInput$ = toObservable(this._searchInputSignal);

  protected readonly searchTermSignal = this._store.filter.searchTerm;

  onClearFilter(): void {
    this._store.updateFilter({ searchTerm: null });
  }

  constructor() {
    // check that searchInput observable has value
    // if has value execute from event
    this._searchInput$
      .pipe(
        filter((value) => !!value?.nativeElement),
        switchMap((value) => {
          return fromEvent(value.nativeElement, 'input').pipe(
            tap(() => this._store.updateIsLoading(true)),
            debounceTime(this._loadDelaySignal()),
            distinctUntilChanged(),
          );
        }),
        map((event: Event) => (event.target as HTMLInputElement).value),
        tap((rawValue) => {
          const searchTerm = rawValue.trim();

          this._store.updateIsLoading(false);

          if (!searchTerm) {
            this._store.updateFilter({ searchTerm: null });
            return;
          }

          this._store.updateFilter({ searchTerm });
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
