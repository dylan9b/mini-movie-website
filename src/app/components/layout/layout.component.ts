import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from '@components/header/header.component';
import { LastVisitedComponent } from '@components/last-visited/last-visited.component';
import { SidenavComponent } from '@components/sidenav/sidenav.component';
import { MovieStore } from '@store/movie.store';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    SidenavComponent,
    LastVisitedComponent,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    HeaderComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements AfterViewInit {
  private readonly _breakpointObserver = inject(BreakpointObserver);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _store = inject(MovieStore);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  protected readonly isMenuCollapsedSignal = this._store.config.isMenuCollapsed;
  protected readonly titleSignal = toSignal(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let child = this._route.firstChild;
        while (child?.firstChild) {
          child = child.firstChild;
        }
        return child?.snapshot?.data?.['title'] || '';
      }),
    ),
  );

  @ViewChild('drawer') drawer!: MatSidenav;

  toggleSidenav(): void {
    this._store.updateIsMenuCollapsed(!this.isMenuCollapsedSignal());
  }

  onBackDropClick(): void {
    this._store.updateIsMenuCollapsed(true);
  }

  // Automatically collapse on mobile
  ngAfterViewInit() {
    this._breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((result) => {
        if (result.matches) {
          this.drawer.mode = 'over';
          this._store.updateIsMenuCollapsed(true);
        } else {
          this.drawer.mode = 'side';
        }
      });
  }
}
