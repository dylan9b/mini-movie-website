// import { BreakpointObserver } from '@angular/cdk/layout';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import { HeaderComponent } from '@components/header/header.component';
// import { LastVisitedComponent } from '@components/last-visited/last-visited.component';
// import { SidenavComponent } from '@components/sidenav/sidenav.component';
// import { MovieStore } from '@store/movie.store';
// import { of } from 'rxjs';
// import { LayoutComponent } from './layout.component';

// describe('LayoutComponent', () => {
//   let component: LayoutComponent;
//   let fixture: ComponentFixture<LayoutComponent>;
//   let storeMock: Partial<MovieStore>;
//   let breakpointObserverMock: Partial<BreakpointObserver>;
//   let routerMock: Partial<Router>;
//   let routeMock: Partial<ActivatedRoute>;

//   beforeEach(async () => {
//     // Mock MovieStore with signals
//     storeMock = {
//       config: {
//         isMenuCollapsed: jasmine
//           .createSpy('isMenuCollapsed')
//           .and.returnValue(true),
//       },
//       updateIsMenuCollapsed: jasmine.createSpy('updateIsMenuCollapsed'),
//     };

//     // Mock BreakpointObserver
//     breakpointObserverMock = {
//       observe: jasmine
//         .createSpy('observe')
//         .and.returnValue(of({ matches: true })),
//     };

//     // Mock Router
//     routerMock = {
//       events: of(new NavigationEnd(1, '/home', '/home')),
//     };

//     // Mock ActivatedRoute
//     routeMock = {
//       firstChild: {
//         firstChild: null,
//         snapshot: { data: { title: 'Home' } },
//       } as ActivatedRoute,
//     };

//     await TestBed.configureTestingModule({
//       imports: [
//         LayoutComponent,
//         MatSidenavModule,
//         MatButtonModule,
//         MatToolbarModule,
//         MatIconModule,
//         HeaderComponent,
//         LastVisitedComponent,
//         SidenavComponent,
//       ],
//       providers: [
//         { provide: MovieStore, useValue: storeMock },
//         { provide: BreakpointObserver, useValue: breakpointObserverMock },
//         { provide: Router, useValue: routerMock },
//         { provide: ActivatedRoute, useValue: routeMock },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(LayoutComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should return correct title from titleSignal', () => {
//     expect(component.titleSignal()).toBe('Home');
//   });

//   it('should toggle sidenav', () => {
//     // initial collapsed = true from mock
//     component.toggleSidenav();
//     expect(storeMock.updateIsMenuCollapsed).toHaveBeenCalledWith(false);

//     component.toggleSidenav();
//     expect(storeMock.updateIsMenuCollapsed).toHaveBeenCalledWith(false); // called twice, second call flips the value again
//   });

//   it('should collapse drawer on handset', () => {
//     // simulate ngAfterViewInit
//     component.ngAfterViewInit();
//     expect(component.drawer.mode).toBe('over');
//     expect(storeMock.updateIsMenuCollapsed).toHaveBeenCalledWith(true);
//   });
// });
