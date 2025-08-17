import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MovieResponse } from '@pages/movies/_model/movie-response.model';
import { MovieComponent } from './movie.component';

describe('MovieComponent', () => {
  let component: MovieComponent;
  let fixture: ComponentFixture<MovieComponent>;
  let img: HTMLImageElement;

  const mockMovie: MovieResponse = {
    id: 'tt0111161',
    title: 'The Shawshank Redemption',
    popularity: 9.3,
    image: {
      url: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
      title: 'The Shawshank Redemption',
    },
    slug: 'the-shawshank-redemption',
    runtime: '142 min',
    released: '14 Oct 1994',
    genres: ['Drama'],
    budget: 28767189,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieComponent);
    fixture.componentRef.setInput('movie', mockMovie); // ✅ Angular 17 way
    component = fixture.componentInstance;
    fixture.detectChanges();

    img = fixture.nativeElement.querySelector('img');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isImageLoaded to true on load event', () => {
    img.dispatchEvent(new Event('load'));
    fixture.detectChanges();

    expect(component['isImageLoaded']).toBeTrue();
    expect(component['isImageBroken']).toBeFalse();
  });

  it('should set isImageBroken to true on error event', () => {
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(component['isImageBroken']).toBeTrue();
    expect(component['isImageLoaded']).toBeFalse();
  });
});
