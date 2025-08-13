import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MovieService } from '@services/movie.service';

@Component({
  selector: 'app-movies',
  imports: [],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesComponent {
  private readonly _movieService = inject(MovieService);
}
