import { BreakpointObserver } from '@angular/cdk/layout';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { MovieStore } from '@store/movie.store';
import { of } from 'rxjs';
import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  const mockStore = {
    config: {
      isMenuCollapsed: jasmine
        .createSpy('isMenuCollapsed')
        .and.returnValue(false),
    },
    lastVisitedSignal: jasmine
      .createSpy('lastVisitedSignal')
      .and.callFake(() => []),
    updateIsMenuCollapsed: jasmine.createSpy('updateIsMenuCollapsed'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LayoutComponent,
        RouterTestingModule,
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [
        {
          provide: BreakpointObserver,
          useValue: { observe: () => of({ matches: false }) },
        },
        { provide: MovieStore, useValue: mockStore },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggleSidenav should call updateIsMenuCollapsed with opposite value', () => {
    component.toggleSidenav();
    expect(mockStore.updateIsMenuCollapsed).toHaveBeenCalledWith(true);

    // Simulate it being true now
    mockStore.config.isMenuCollapsed.and.returnValue(true);
    component.toggleSidenav();
    expect(mockStore.updateIsMenuCollapsed).toHaveBeenCalledWith(false);
  });

  it('onBackDropClick should call updateIsMenuCollapsed with true', () => {
    component.onBackDropClick();
    expect(mockStore.updateIsMenuCollapsed).toHaveBeenCalledWith(true);
  });
});
