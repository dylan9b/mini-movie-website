// loading.component.spec.ts
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieStore } from '@store/movie.store';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  // Mock store
  const mockStore = {
    config: {
      loadOffset: signal(42), // provide a test signal value
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingComponent], // standalone component
      providers: [
        { provide: MovieStore, useValue: mockStore },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose loadOffsetSignal from the store', () => {
    expect(component['loadOffsetSignal']()).toBe(42);
  });
});
