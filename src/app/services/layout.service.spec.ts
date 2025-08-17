import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  let service: LayoutService;
  let mockBreakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let observeSubject: BehaviorSubject<BreakpointState>;

  beforeEach(() => {
    observeSubject = new BehaviorSubject<BreakpointState>({
      matches: false,
      breakpoints: {},
    });

    mockBreakpointObserver = jasmine.createSpyObj('BreakpointObserver', [
      'observe',
    ]);
    mockBreakpointObserver.observe.and.returnValue(
      observeSubject.asObservable(),
    );

    TestBed.configureTestingModule({
      providers: [
        LayoutService,
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(LayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false when not handset', () => {
    observeSubject.next({
      matches: false,
      breakpoints: { [Breakpoints.Handset]: false },
    });
    expect(service.isMobileSignal()).toBeFalse();
  });

  it('should return true when handset', () => {
    observeSubject.next({
      matches: true,
      breakpoints: { [Breakpoints.Handset]: true },
    });
    expect(service.isMobileSignal()).toBeTrue();
  });

  it('should react to changes in breakpoint observer', () => {
    observeSubject.next({
      matches: false,
      breakpoints: { [Breakpoints.Handset]: false },
    });
    expect(service.isMobileSignal()).toBeFalse();

    observeSubject.next({
      matches: true,
      breakpoints: { [Breakpoints.Handset]: true },
    });
    expect(service.isMobileSignal()).toBeTrue();
  });
});
