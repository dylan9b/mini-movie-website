import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieComponent } from '@components/movie/movie.component';
import { MovieStore } from '@store/movie.store';
import { LastVisitedComponent } from './last-visited.component';

describe('LastVisitedComponent', () => {
  let component: LastVisitedComponent;
  let fixture: ComponentFixture<LastVisitedComponent>;

  const mockStore = {
    lastVisitedSignal: jasmine.createSpy('lastVisitedSignal'),
    config: { isMenuCollapsed: jasmine.createSpy('isMenuCollapsed') },
  };

  // Type helper to access protected members in tests
  interface LastVisitedComponentTest {
    lastVisitedSignal: jasmine.Spy;
    isMenuCollapsedSignal: jasmine.Spy;
    isMobileSignal: jasmine.Spy;
    placeholdersSignal: () => unknown[];
  }
  let testComponent: LastVisitedComponentTest;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastVisitedComponent, MovieComponent],
      providers: [
        { provide: MovieStore, useValue: mockStore },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LastVisitedComponent);
    component = fixture.componentInstance;
    testComponent = component as unknown as LastVisitedComponentTest;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose lastVisitedSignal from the store', () => {
    const fakeVisited = ['Movie 1', 'Movie 2'];
    mockStore.lastVisitedSignal.and.returnValue(fakeVisited);

    const result = testComponent.lastVisitedSignal();

    expect(result).toEqual(fakeVisited);
    expect(mockStore.lastVisitedSignal).toHaveBeenCalled();
  });

  it('should expose isMenuCollapsedSignal from the store', () => {
    mockStore.config.isMenuCollapsed.and.returnValue(true);

    const result = testComponent.isMenuCollapsedSignal();

    expect(result).toBeTrue();
    expect(mockStore.config.isMenuCollapsed).toHaveBeenCalled();
  });

  it('should compute placeholdersSignal correctly', () => {
    mockStore.lastVisitedSignal.and.returnValue(['Movie 1', 'Movie 2']);

    const placeholders = testComponent.placeholdersSignal();

    expect(placeholders.length).toBe(3); // 5 - 2
  });
});
