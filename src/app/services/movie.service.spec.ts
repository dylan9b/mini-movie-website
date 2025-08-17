// movie.service.spec.ts
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { MovieResponse } from '@pages/movies/_model/movie-response.model';
import { MovieService } from './movie.service';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideZonelessChangeDetection()],
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll$ should perform GET and return MovieResponse[] on success', () => {
    const mockResponse: MovieResponse[] = [
      {
        id: 1,
        title: 'Inception',
      } as unknown as MovieResponse,
      {
        id: 2,
        title: 'Interstellar',
      } as unknown as MovieResponse,
    ];

    let emitted: MovieResponse[] | undefined;
    let completed = false;
    let errored = false;

    // Act
    service.getAll$().subscribe({
      next: (data) => (emitted = data),
      error: () => (errored = true),
      complete: () => (completed = true),
    });

    const req = httpMock.expectOne(environment.url);
    expect(req.request.method).toBe('GET');

    // Respond with mock data
    req.flush(mockResponse);

    // Assert
    expect(emitted).toEqual(mockResponse);
    expect(errored).toBeFalse();
    expect(completed).toBeTrue();
  });

  it('getAll$ should complete without emitting when the HTTP call errors (catchError -> EMPTY)', () => {
    const nextSpy = jasmine.createSpy('next');
    const errorSpy = jasmine.createSpy('error');
    const completeSpy = jasmine.createSpy('complete');

    service.getAll$().subscribe({
      next: nextSpy,
      error: errorSpy,
      complete: completeSpy,
    });

    const req = httpMock.expectOne(environment.url);
    expect(req.request.method).toBe('GET');

    // Simulate server error
    req.flush('Server error', { status: 500, statusText: 'Server Error' });

    // Because catchError returns EMPTY, no next/error notifications should fire, only complete
    expect(nextSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
