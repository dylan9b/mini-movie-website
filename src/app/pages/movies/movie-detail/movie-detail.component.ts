import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.subscribeRouteParams();
  }

  private subscribeRouteParams(): void {
    this._route.paramMap
      .pipe(
        map((params) => {
          console.log('params', params.get('slug'));
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
