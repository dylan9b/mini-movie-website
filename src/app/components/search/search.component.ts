import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MovieStore } from '@store/movie.store';
import { debounceTime, distinctUntilChanged, fromEvent, map, tap } from 'rxjs';
@Component({
  selector: 'app-search',
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements AfterViewInit {
  private readonly _store = inject(MovieStore);
  private readonly _loadDelaySignal = this._store.config.loadDelay;
  private readonly _destroyRef = inject(DestroyRef);

  protected readonly searchTermSignal = this._store.filter.searchTerm;

  @ViewChild('searchInput', { static: true })
  searchInput!: ElementRef<HTMLInputElement>;

  onClearFilter(): void {
    this._store.updateFilter({ searchTerm: null });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        tap(() => this._store.updateIsLoading(true)),
        map((event: Event) => (event.target as HTMLInputElement).value.trim()),
        debounceTime(this._loadDelaySignal()),
        distinctUntilChanged(),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((searchTerm) => {
        this._store.updateIsLoading(false);
        this._store.updateFilter({ searchTerm });
      });
  }
}
