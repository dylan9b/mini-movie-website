import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { SearchComponent } from '@components/search/search.component';
import { MovieStore } from '@store/movie.store';
@Component({
  selector: 'app-movies',
  imports: [
    MatButtonModule,
    SearchComponent,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesComponent {
  private readonly _store = inject(MovieStore);
  protected readonly isLoadingSignal = this._store.isLoading;
  protected readonly loadOffsetSignal = this._store.config.loadOffset;
  protected readonly moviesSignal = this._store.moviesSignal;
  protected readonly genreSignal = this._store.genreSignal;
  protected readonly selectedGenresSignal = this._store.filter.genre;

  protected readonly isLoadMoreDisabled = computed(
    () =>
      this.moviesSignal().length <
      this._store.filterSignal().first + this._store.filterSignal().offset,
  );

  onLoadMoreClick(): void {
    this._store.updateFilter({
      offset: this._store.filterSignal().offset + this.loadOffsetSignal(),
    });
  }

  onGenreChange(event: MatSelectChange<string>): void {
    this._store.updateFilter({
      genre: [...event.value],
    });
  }

  onClearGenres(): void {
    this._store.updateFilter({
      genre: null,
    });
  }
}
