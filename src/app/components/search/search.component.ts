import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MovieStore } from '@store/movie.store';

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
  protected readonly searchTermSignal = this._store.searchTermSignal;

  onClearFilter(): void {
    this._store.updateFilter({ searchTerm: '' });
  }

  onSubmitSearchTerm(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.replace(/\s/g, '');

    if (
      searchTerm.toLocaleLowerCase() !==
      this.searchTermSignal()?.toLocaleLowerCase()
    ) {
      this._store.updateFilter({ searchTerm });
    }
  }
}
