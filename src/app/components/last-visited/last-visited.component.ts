import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MovieComponent } from '@components/movie/movie.component';
import { LayoutService } from '@services/layout.service';
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
  private readonly _layoutService = inject(LayoutService);

  protected readonly lastVisitedSignal = this._store.lastVisitedSignal;
  protected readonly isMenuCollapsedSignal = this._store.config.isMenuCollapsed;
  protected readonly isMobileSignal = this._layoutService.isMobileSignal;
  protected readonly placeholdersSignal = computed(() => {
    return Array.from({ length: 5 - this.lastVisitedSignal().length });
  });
}
