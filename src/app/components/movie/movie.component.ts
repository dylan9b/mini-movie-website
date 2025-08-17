import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieResponse } from '@pages/movies/_model/movie-response.model';

@Component({
  selector: 'app-movie',
  imports: [RouterLink],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieComponent {
  protected isImageLoaded = false;
  protected isImageBroken = false;

  readonly movie = input.required<MovieResponse>();
}
