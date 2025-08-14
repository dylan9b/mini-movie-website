import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MovieStore } from '@store/movie.store';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  private readonly _store = inject(MovieStore);
  protected readonly loadOffsetSignal = this._store.config.loadOffset;
}
