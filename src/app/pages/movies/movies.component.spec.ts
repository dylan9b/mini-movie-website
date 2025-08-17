import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { provideRouter } from '@angular/router';
import { AlertComponent } from '@components/alert/alert.component';
import { DropdownComponent } from '@components/dropdown/dropdown.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { MovieComponent } from '@components/movie/movie.component';
import { SearchComponent } from '@components/search/search.component';
import { MovieStore } from '@store/movie.store';
import { MovieResponse } from './_model/movie-response.model';
import { MoviesComponent } from './movies.component';

describe('MoviesComponent (zoneless)', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;

  const mockMovie: MovieResponse = {
    id: '1',
    title: 'Inception',
    popularity: 8.8,
    image: { url: 'some-url', title: 'Inception' },
    slug: 'inception',
    runtime: '148 min',
    released: '2010-07-16',
    genres: ['Sci-Fi'],
    budget: 160000000,
  };

  // Mock signals
  const moviesSignal = signal<MovieResponse[]>([mockMovie]);
  const filter = {
    first: signal(10),
    offset: signal(0),
    searchTerm: signal(null),
    genre: signal(null),
  };
  const config = {
    loadDelay: signal(500),
    loadOffset: signal(10),
  };
  const isLoading = signal(false);
  const genreSignal = signal(['Action', 'Animation', 'Adventure']);

  const mockStore = {
    moviesSignal,
    genreSignal,
    filter,
    config,
    isLoading,
    updateFilter: jasmine.createSpy('updateFilter'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MoviesComponent,
        MatButtonModule,
        SearchComponent,
        DropdownComponent,
        MovieComponent,
        AlertComponent,
        LoadingComponent,
      ],
      providers: [
        { provide: MovieStore, useValue: mockStore },
        provideZonelessChangeDetection(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateFilter on load more click if enabled', async () => {
    // Add enough movies to enable "Load More"
    moviesSignal.set(Array(11).fill(mockMovie));

    await Promise.resolve();
    component.onLoadMoreClick();

    expect(mockStore.updateFilter).toHaveBeenCalledWith({
      offset: filter.offset() + config.loadOffset(),
    });
  });
});
