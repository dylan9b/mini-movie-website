import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MovieStore } from '@store/movie.store';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  standalone: true,
  imports: [MatSelectModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  private readonly _store = inject(MovieStore);
  protected readonly genreSignal = this._store.genreSignal;
  protected readonly selectedGenresSignal = this._store.filter.genre;

  onGenreChange(event: MatSelectChange<string>): void {
    this._store.updateFilter({
      genre: [...event.value],
    });
  }

  onClearGenres(): void {
    this._store.updateFilter({
      genre: null,
      offset: 0,
    });
  }
}
