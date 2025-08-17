import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectChange } from '@angular/material/select';
import { MovieStore } from '@store/movie.store';
import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  const mockStore = {
    genreSignal: jasmine.createSpy('genreSignal'),
    filter: { genre: jasmine.createSpy('genreSignal') },
    updateFilter: jasmine.createSpy('updateFilter'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownComponent],
      providers: [
        { provide: MovieStore, useValue: mockStore },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onGenreChange', () => {
    it('should call store.updateFilter with event values', () => {
      const event = {
        value: ['Action', 'Drama'],
      } as unknown as MatSelectChange<string>;

      component.onGenreChange(event);

      expect(mockStore.updateFilter).toHaveBeenCalledWith({
        genre: ['Action', 'Drama'],
      });
    });
  });

  describe('onClearGenres', () => {
    it('should reset genre and offset', () => {
      component.onClearGenres();

      expect(mockStore.updateFilter).toHaveBeenCalledWith({
        genre: null,
        offset: 0,
      });
    });
  });
});
