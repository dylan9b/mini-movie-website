import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly _breakpointObserver = inject(BreakpointObserver);

  isMobileSignal = toSignal(
    this._breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map((result) => result.matches)),
  );
}
