// import { signal } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ActivatedRoute, convertToParamMap } from '@angular/router';
// import { MovieStore } from '@store/movie.store';
// import { of } from 'rxjs';
// import { MovieResponse } from '../_model/movie-response.model';
// import { MovieDetailComponent } from './movie-detail.component';

// describe('MovieDetailComponent', () => {
//   let component: MovieDetailComponent;
//   let fixture: ComponentFixture<MovieDetailComponent>;
//   let storeMock: Partial<MovieStore>;
//   let routeMock: Partial<ActivatedRoute>;

//   const testMovie: MovieResponse = {
//     id: 1,
//     title: 'Test Movie',
//     slug: 'test-movie',
//     overview: 'Test overview',
//     release_date: '2025-01-01',
//     vote_average: 8,
//     vote_count: 100,
//     poster_path: 'path/to/poster',
//     backdrop_path: 'path/to/backdrop',
//   };

//   beforeEach(async () => {
//     // Mock MovieStore signals
//     storeMock = {
//       movies: signal<{ [slug: string]: MovieResponse }>({
//         'test-movie': testMovie,
//       }),
//       addVisited: jasmine.createSpy('addVisited'),
//     };

//     // Mock ActivatedRoute with slug param
//     routeMock = {
//       paramMap: of(convertToParamMap({ slug: 'test-movie' })),
//     };

//     await TestBed.configureTestingModule({
//       imports: [MovieDetailComponent],
//       providers: [
//         { provide: MovieStore, useValue: storeMock },
//         { provide: ActivatedRoute, useValue: routeMock },
//         { provide: 'DestroyRef', useValue: {} },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(MovieDetailComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should set movieDetailSignal based on route slug', () => {
//     // Access the signal value
//     const movie = component['movieDetailSignal']();
//     expect(movie).toBeDefined();
//     expect(movie?.title).toBe('Test Movie');

//     // Ensure addVisited was called
//     expect(storeMock.addVisited).toHaveBeenCalledWith(testMovie);
//   });
// });
