import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieComponent } from '@components/movie/movie.component';
import { MovieStore } from '@store/movie.store';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const mockStore = {
    topMoviesSignal: jasmine.createSpy('topMoviesSignal'),
  };

  interface HomeComponentTest {
    topMoviesSignal: jasmine.Spy;
  }
  let testComponent: HomeComponentTest;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, MovieComponent],
      providers: [
        { provide: MovieStore, useValue: mockStore },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    testComponent = component as unknown as HomeComponentTest;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose topMoviesSignal from the store', () => {
    const fakeMovies = [{ title: 'Movie 1' }, { title: 'Movie 2' }];
    mockStore.topMoviesSignal.and.returnValue(fakeMovies);

    const topMovies = testComponent.topMoviesSignal();

    expect(topMovies).toEqual(fakeMovies);
    expect(mockStore.topMoviesSignal).toHaveBeenCalled();
  });
});
