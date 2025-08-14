import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MovieComponent } from '@components/movie/movie.component';
import { TitleComponent } from '@components/title/title.component';
import { MovieStore } from '@store/movie.store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [MovieComponent, TitleComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly _store = inject(MovieStore);

  protected readonly topMoviesSignal = this._store.topMoviesSignal;
}
