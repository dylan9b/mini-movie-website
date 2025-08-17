import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MovieStore } from '@store/movie.store';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const isMenuCollapsed = signal(false); // default signal state
  const mockStore = {
    config: {
      isMenuCollapsed, // bound to signal
    },
    updateIsMenuCollapsed: jasmine.createSpy('updateIsMenuCollapsed'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent], // standalone component
      providers: [
        { provide: MovieStore, useValue: mockStore },
        provideRouter([]),
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 'Test Header');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleSidenav', () => {
    it('should call store.updateIsMenuCollapsed with true when collapsed is false', () => {
      isMenuCollapsed.set(false); // ensure initial state
      component['toggleSidenav']();
      expect(mockStore.updateIsMenuCollapsed).toHaveBeenCalledWith(true);
    });

    it('should call store.updateIsMenuCollapsed with false when collapsed is true', () => {
      isMenuCollapsed.set(true); // set state to true
      component['toggleSidenav']();
      expect(mockStore.updateIsMenuCollapsed).toHaveBeenCalledWith(false);
    });
  });
});
