import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MovieStore } from '@store/movie.store';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly _store = inject(MovieStore);
  private readonly _isMenuCollapsedSignal = this._store.config.isMenuCollapsed;

  readonly value = input.required<string>();

  toggleSidenav(): void {
    this._store.updateIsMenuCollapsed(!this._isMenuCollapsedSignal());
  }
}
