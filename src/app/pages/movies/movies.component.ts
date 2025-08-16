import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewChild,
} from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertComponent } from '@components/alert/alert.component';
import { DropdownComponent } from '@components/dropdown/dropdown.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { MovieComponent } from '@components/movie/movie.component';
import { SearchComponent } from '@components/search/search.component';
import { MovieStore } from '@store/movie.store';
@Component({
  selector: 'app-movies',
  imports: [
    MatButtonModule,
    SearchComponent,
    MatFormFieldModule,
    DropdownComponent,
    MovieComponent,
    AlertComponent,
    LoadingComponent,
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

  @ViewChild('loadMoreBtn') loadMoreBtn!: MatButton;

  protected readonly isLoadMoreDisabled = computed(
    () =>
      this.moviesSignal().length <
      this._store.filterSignal().first + this._store.filterSignal().offset,
  );

  onLoadMoreClick(): void {
    if (!this.isLoadMoreDisabled()) {
      this._store.updateFilter({
        offset: this._store.filterSignal().offset + this.loadOffsetSignal(),
      });
    }
  }
}
