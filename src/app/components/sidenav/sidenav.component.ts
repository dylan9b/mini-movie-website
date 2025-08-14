import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MovieStore } from '@store/movie.store';
import { SideNavModel } from './_model/sidenav-model';
@Component({
  selector: 'app-sidenav',
  imports: [
    MatListModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  private readonly _store = inject(MovieStore);

  protected readonly sideNavItems: SideNavModel[] = [
    {
      label: 'Home',
      path: '/home',
    },
    {
      label: 'Movies',
      path: '/movies',
    },
  ];

  onCloseClick(): void {
    this._store.updateIsMenuCollapsed(true);
  }
}
