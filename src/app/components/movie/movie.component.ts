import { NgClass, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { IsActiveMatchOptions, RouterLink } from '@angular/router';
import { MovieResponse } from '@pages/movies/_model/movie-response.model';

@Component({
  selector: 'app-movie',
  imports: [UpperCasePipe, RouterLink, NgClass],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieComponent {
  readonly movie = input.required<MovieResponse>();

  readonly myMatchOptions: IsActiveMatchOptions = {
    queryParams: 'ignored',
    matrixParams: 'subset',
    paths: 'subset',
    fragment: 'exact',
  };

  readonly movieImageSignal = computed(() => {
    return this.movie()?.image?.url ?? 'assets/images/empty.jpg';
  });

  onPlayForFun(): void {
    window.open(this.movie()?.slug, '_blank');
  }
}
