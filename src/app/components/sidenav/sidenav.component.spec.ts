import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MovieStore } from '@store/movie.store';
import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  const mockStore = {
    updateIsMenuCollapsed: jasmine.createSpy('updateIsMenuCollapsed'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavComponent],
      providers: [
        { provide: MovieStore, useValue: mockStore },
        provideRouter([]),
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose 2 sideNavItems with Home and Movies', () => {
    expect(component['sideNavItems'].length).toBe(2);
    expect(component['sideNavItems'][0]).toEqual({
      label: 'Home',
      path: '/home',
    });
    expect(component['sideNavItems'][1]).toEqual({
      label: 'Movies',
      path: '/movies',
    });
  });

  it('onCloseClick should call store.updateIsMenuCollapsed with true', () => {
    component.onCloseClick();
    expect(mockStore.updateIsMenuCollapsed).toHaveBeenCalledWith(true);
  });
});
