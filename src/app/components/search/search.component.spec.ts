import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MovieStore } from '@store/movie.store';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  const filter = {
    first: signal(10),
    offset: signal(0),
    searchTerm: signal(null),
    genre: signal(null),
  };

  const mockStore = {
    config: {
      loadDelay: () => 300, // debounce delay
    },
    filter,
    updateFilter: jasmine.createSpy('updateFilter'),
    updateIsLoading: jasmine.createSpy('updateIsLoading'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        { provide: MovieStore, useValue: mockStore },
        provideRouter([]),
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onClearFilter should call store.updateFilter with searchTerm null', () => {
    component.onClearFilter();
    expect(mockStore.updateFilter).toHaveBeenCalledWith({ searchTerm: null });
  });

  it('should debounce input and call updateFilter with entered value', async () => {
    const inputEl: HTMLInputElement = component.searchInput.nativeElement;

    // type into input
    inputEl.value = 'Inception';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Immediately: only updateIsLoading(true) should be called
    expect(mockStore.updateIsLoading).toHaveBeenCalledWith(true);

    // Wait slightly less than debounce delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(mockStore.updateFilter).not.toHaveBeenCalledWith({
      searchTerm: 'Inception',
    });

    // Wait past debounce delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    fixture.detectChanges();

    expect(mockStore.updateIsLoading).toHaveBeenCalledWith(false);
    expect(mockStore.updateFilter).toHaveBeenCalledWith({
      searchTerm: 'Inception',
    });
  });

  it('should not emit duplicate consecutive search terms', async () => {
    const inputEl: HTMLInputElement = component.searchInput.nativeElement;

    // First value
    inputEl.value = 'Matrix';
    inputEl.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Second identical value
    inputEl.value = 'Matrix';
    inputEl.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 350));

    const calls = mockStore.updateFilter.calls
      .allArgs()
      .filter((args) => args[0].searchTerm === 'Matrix');
    expect(calls.length).toBe(1);
  });
});
