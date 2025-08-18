import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MovieComponent } from '@components/movie/movie.component';
import { MovieStore } from '@store/movie.store';

@Component({
  selector: 'app-last-visited',
  imports: [MovieComponent],
  templateUrl: './last-visited.component.html',
  styleUrl: './last-visited.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastVisitedComponent {
  private readonly _store = inject(MovieStore);

  protected readonly lastVisitedSignal = this._store.lastVisitedSignal;
  protected readonly isMenuCollapsedSignal = this._store.config.isMenuCollapsed;
  protected readonly placeholdersSignal = computed(() => {
    return Array.from({ length: 5 - this.lastVisitedSignal().length });
  });
}
