import { TestBed } from '@angular/core/testing';
import { PlatformService } from './platform.service';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';

describe('PlatformService', () => {
  let service: PlatformService;

  describe('when platform is browser', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideZonelessChangeDetection(),
        ],
      });
      service = TestBed.inject(PlatformService);
    });

    it('should detect isBrowser as true', () => {
      expect(service.isBrowser).toBeTrue();
    });

    it('should detect isServer as false', () => {
      expect(service.isServer).toBeFalse();
    });

    it('should return localStorage', () => {
      expect(service.localStorage).toBe(localStorage);
    });
  });

  describe('when platform is server', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: 'server' },
          provideZonelessChangeDetection(),
        ],
      });
      service = TestBed.inject(PlatformService);
    });

    it('should detect isBrowser as false', () => {
      expect(service.isBrowser).toBeFalse();
    });

    it('should detect isServer as true', () => {
      expect(service.isServer).toBeTrue();
    });

    it('should return null for localStorage', () => {
      expect(service.localStorage).toBeNull();
    });
  });
});
