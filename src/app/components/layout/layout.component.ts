import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from '@components/sidenav/sidenav.component';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    SidenavComponent,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements AfterViewInit {
  private readonly _breakpointObserver = inject(BreakpointObserver);
  private readonly _destroyRef = inject(DestroyRef);

  @ViewChild('drawer') drawer!: MatSidenav;
  protected isCollapsed = false;

  toggleSidenav(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onBackDropClick(): void {
    this.isCollapsed = true;
  }

  // Automatically collapse on mobile
  ngAfterViewInit() {
    this._breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((result) => {
        if (result.matches) {
          this.drawer.mode = 'over';
          this.isCollapsed = true;
        } else {
          this.drawer.mode = 'side';
        }
      });
  }
}
